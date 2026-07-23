from django.contrib import admin, messages
from .models import (
    Room,
    Reservation,
    RoomReserved,
)
from django.template import Context, Template
import structlog
from modeltranslation.admin import TabbedTranslationAdmin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import get_object_or_404, render, redirect
from django.core.exceptions import PermissionDenied, BadRequest
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from .forms import ReservationReplyForm
from django.conf import settings
from .notifications.tasks import send_task_async, send_to_client


class RoomReservedInline(admin.TabularInline):
    model = RoomReserved


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    inlines = [RoomReservedInline]
    fields = [
        "status",
        "guest_name",
        "email",
        "check_in",
        "check_out",
        "nights",
        "message",
        "created_at",
    ]
    list_display = ["status", "created_at", "check_in", "check_out"]
    readonly_fields = ["created_at"]

    def get_urls(self):

        urls = super().get_urls()
        opts = self.model._meta
        custom_urls = [
            path(
                "<int:object_id>/confirm/",
                self.admin_site.admin_view(self.confirm_reservation),
                name=f"{opts.app_label}_{opts.model_name}_confirm",
            ),
            path(
                "<int:object_id>/decline/",
                self.admin_site.admin_view(self.decline_reservation),
                name=f"{opts.app_label}_{opts.model_name}_decline",
            ),
            path(
                "<int:object_id>/reply/",
                self.admin_site.admin_view(self.reply_reservation),
                name=f"{opts.app_label}_{opts.model_name}_reply",
            ),
        ]
        return custom_urls + urls

    def confirm_reservation(self, request, object_id):
        reservation = get_object_or_404(self.model, pk=object_id)
        if not reservation:
            raise BadRequest
        if not self.has_change_permission(request, reservation):
            raise PermissionDenied
        if reservation.status == Reservation.Status.CONFIRMED:
            self.message_user(
                request,
                _("Reservation is already confirmed."),
                level=messages.WARNING,
            )
            return redirect("..")

        if reservation.status == Reservation.Status.REQUESTED:
            self.message_user(
                request,
                _("Reservation is not validated yet."),
                level=messages.WARNING,
            )
            return redirect("..")

        message_init = _(
            "Dear {{user}}.\n\nYour reservation for "
            "{{site_name}} has been confirmed! We will be waiting for you "
            "on {{check_in|date:'DATE_FORMAT'}}. If you need to contact us please "
            "send a mail to {{manager_email}}."
        )
        message_context = Context(
            {
                "user": reservation.guest_name,
                "site_name": settings.SITE_NAME,
                "check_in": reservation.check_in,
                "check_out": reservation.check_out,
                "manager_email": settings.MANAGERS[0],
            }
        )
        message_compiled = Template(message_init).render(message_context)
        if request.method == "POST":
            form = ReservationReplyForm(message_compiled, request.POST)
            if form.is_valid():
                email_body = form.cleaned_data["email_body"]
                with transaction.atomic():
                    reservation.confirm()
                self.message_user(
                    request,
                    _("Reservation is confirmed and email notification sent."),
                    level=messages.SUCCESS,
                )
                log_context = structlog.contextvars.get_contextvars()
                send_task_async(
                    send_to_client,
                    log_context,
                    reservation=reservation,
                    email_body=email_body,
                    email_title=_(
                        "Your reservation in %(site_name)s has been confirmed."
                    )
                    % {"site_name": settings.SITE_NAME},
                    subject=_("Booking request is confirmed"),
                )
                return redirect("/admin/main/reservation")
            else:
                raise Exception("Invalid form data")
        else:
            form = ReservationReplyForm(message_compiled)

            context = {
                "title": _("Confirm reservation #%s") % object_id,
                "form": form,
                "reservation": reservation,
                "opts": self.model._meta,
            }
            return render(request, "admin/main/reservation/reply_form.html", context)

    def decline_reservation(self, request, object_id):
        reservation = get_object_or_404(self.model, pk=object_id)
        if not reservation:
            raise BadRequest
        if not self.has_change_permission(request, reservation):
            raise PermissionDenied
        if reservation.status == Reservation.Status.CONFIRMED:
            self.message_user(
                request,
                _("Reservation is already confirmed."),
                level=messages.WARNING,
            )
            return redirect("..")

        if reservation.status == Reservation.Status.REQUESTED:
            self.message_user(
                request,
                _("Reservation is not validated yet."),
                level=messages.WARNING,
            )
            return redirect("..")

        message_init = _(
            "Dear {{user}}.\n\nUnfortunately, we cannot accommodate "
            "you during the requested period. "
            "The rooms will be available on: <dates and rooms>. "
            "\n\nIf you need to contact us please "
            "send a mail to {{manager_email}}.\n"
            "<check-in> {{check_in}}\n"
            "<check-out> {{check_out}}\n"
            "<manager-email> {{manager_email}}"
        )

        message_context = Context(
            {
                "user": reservation.guest_name,
                "site_name": settings.SITE_NAME,
                "check_in": reservation.check_in,
                "check_out": reservation.check_out,
                "manager_email": settings.MANAGERS[0],
            }
        )
        message_compiled = Template(message_init).render(message_context)
        if request.method == "POST":
            form = ReservationReplyForm(message_compiled, request.POST)
            if form.is_valid():
                email_body = form.cleaned_data["email_body"]

                with transaction.atomic():
                    reservation.decline()
                self.message_user(
                    request,
                    _("Reservation is declined and email notification sent."),
                    level=messages.SUCCESS,
                )
                log_context = structlog.contextvars.get_contextvars()
                send_task_async(
                    send_to_client,
                    log_context,
                    reservation=reservation,
                    email_body=email_body,
                    email_title=_(
                        "Your reservation in %(site_name)s has been declined."
                    )
                    % {"site_name": settings.SITE_NAME},
                    subject=_("Booking request is declined"),
                )
                return redirect("/admin/main/reservation")
        else:
            print("DECLINE GET")
            form = ReservationReplyForm(message_compiled)

            context = {
                "title": _("Decline reservation #%s") % object_id,
                "form": form,
                "reservation": reservation,
                "opts": self.model._meta,
                "site_name": settings.SITE_NAME,
                "manager_email": settings.MANAGERS[0],
            }
            return render(request, "admin/main/reservation/reply_form.html", context)

    def reply_reservation(self, request, object_id):
        reservation = get_object_or_404(self.model, pk=object_id)
        if not reservation:
            raise BadRequest
        if not self.has_change_permission(request, reservation):
            raise PermissionDenied

        message_init = _(
            "Dear {{user}}.\n\n"
            "<check-in> {{check_in}}\n"
            "<check-out> {{check_out}}\n"
            "<manager-email> {{manager_email}}"
        )

        message_context = Context(
            {
                "user": reservation.guest_name,
                "site_name": settings.SITE_NAME,
                "check_in": reservation.check_in,
                "check_out": reservation.check_out,
                "manager_email": settings.MANAGERS[0],
            }
        )
        message_compiled = Template(message_init).render(message_context)
        if request.method == "POST":
            form = ReservationReplyForm(message_init, request.POST)
            if form.is_valid():
                email_body = form.cleaned_data["email_body"]

                self.message_user(
                    request,
                    _("The email has beed sent to the user."),
                    level=messages.SUCCESS,
                )
                log_context = structlog.contextvars.get_contextvars()
                send_task_async(
                    send_to_client,
                    log_context,
                    reservation=reservation,
                    email_body=email_body,
                    email_title=_(
                        "A message from %(site_name)s regarding your booking request."
                    )
                    % {"site_name": settings.SITE_NAME},
                    subject=_("A message from %(site_name)s")
                    % {"site_name": settings.SITE_NAME},
                )
                return redirect("/admin/main/reservation")
        else:
            form = ReservationReplyForm(message_compiled)

            context = {
                "title": _("Reply to client %s") % reservation.guest_name,
                "form": form,
                "reservation": reservation,
                "opts": self.model._meta,
                "site_name": settings.SITE_NAME,
                "manager_email": settings.MANAGERS[0],
            }
            return render(request, "admin/main/reservation/reply_form.html", context)


@admin.register(RoomReserved)
class RoomReservedAdmin(admin.ModelAdmin):
    list_display = ("room", "adults", "children")


@admin.register(Room)
class RoomAdmin(TabbedTranslationAdmin):
    list_display = ("name", "adults_num")
    # inlines = [RoomImageInline]

    def thumbnail(self, obj):
        first_img = obj.images.first()
        if first_img and first_img.image_full:
            return format_html(
                '<img src="{}" style="max-height: 60px; border-radius: 4px; display: inline-block" /><div>{}</div>',
                first_img.image_full.url,
            )
        return "-"

    thumbnail.short_description = "Preview"
