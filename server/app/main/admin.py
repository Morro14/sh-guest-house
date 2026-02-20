from django.contrib import admin, messages
from .models import (
    Room,
    Reservation,
    RoomReserved,
)
from modeltranslation.admin import TabbedTranslationAdmin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.db import transaction
from django.utils.translation import gettext_lazy as _


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
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
    readonly_fields = [
        "created_at",
    ]

    def get_queryset(self, request):
        return Reservation.objects.all()

    def get_urls(self):

        urls = super().get_urls()
        custom_urls = [
            path(
                "confirm/<int:object_id>",
                self.admin_site.admin_view(self.confirm_reservation),
                name="reservation-confirm",
            )
        ]
        return urls + custom_urls

    def confirm_reservation(self, request, object_id):
        reservation = Reservation.objects.get(pk=5)
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
                level=messages.WARNmNG,
            )
            return redirect("..")

        with transaction.atomic():
            reservation.confirm()

        self.message_user(
            request,
            _("Reservation confirmed and email notification sent."),
            level=messages.SUCCESS,
        )

        return redirect("/admin/main/reservation")


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
