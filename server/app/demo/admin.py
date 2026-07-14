from django.contrib import admin, messages
from .models import (
    ImageTagDemo,
    ContentPageDemo,
    ReservationDemo,
    RoomReservedDemo,
    RoomDemo,
    WideImageDemo,
    GridImageDemo,
    RoomImageDemo,
    ImageGridDemo,
    PlaceDemo,
    PlaceImageDemo,
)
import os

from modeltranslation.admin import TabbedTranslationAdmin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied, BadRequest
from django.shortcuts import redirect
from django.db import transaction
from django.utils.translation import gettext_lazy as _


@admin.register(ReservationDemo)
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

    def get_urls(self):

        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:object_id>/confirm",
                self.admin_site.admin_view(self.confirm_reservation),
                name="reservation-confirm",
            )
        ]
        return custom_urls + urls

    def confirm_reservation(self, request, object_id):
        reservation = get_object_or_404(self.model, pk=object_id)
        if not reservation:
            raise BadRequest
        if not self.has_change_permission(request, reservation):
            raise PermissionDenied
        if reservation.status == ReservationDemo.Status.CONFIRMED:
            self.message_user(
                request,
                _("Reservation is already confirmed."),
                level=messages.WARNING,
            )
            return redirect("..")

        if reservation.status == ReservationDemo.Status.REQUESTED:
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


@admin.register(RoomReservedDemo)
class RoomReservedDemoAdmin(admin.ModelAdmin):
    list_display = ("room", "adults", "children")


@admin.register(RoomDemo)
class RoomDemoAdmin(TabbedTranslationAdmin):
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


@admin.register(WideImageDemo)
class WideImageDemoAmin(admin.ModelAdmin):
    fields = ["alt_text", "order", "image_full", "tag"]


@admin.register(ImageGridDemo)
class ImageGridDemoAdmin(admin.ModelAdmin):
    list_display = ["index", "pk"]


@admin.register(GridImageDemo)
class GridImageDemoAmin(admin.ModelAdmin):
    fields = ["alt_text", "grid", "order", "image_full", "tag", "format_in_grid"]
    list_display = ["format_in_grid", "grid", "alt_text", "image_full", "preview"]
    readonly_fields = ("preview",)
    ordering = ("grid", "format_in_grid")
    list_filter = ["grid"]

    def preview(self, obj):
        if obj.image_full:
            return format_html(
                '<img src="{}" style="max-height: 80px; border-radius: 4px;" />',
                obj.variants["small"],
            )
        return "-"


@admin.register(PlaceImageDemo)
class PlaceImageDemoAdmin(admin.ModelAdmin):
    fields = ["alt_text", "order", "image_full", "place"]
    list_display = ("place", "order", "image_full", "preview")
    readonly_fields = ("preview",)
    list_filter = ["place__name"]
    ordering = ("place", "order")

    def preview(self, obj):
        if obj.image_full:
            return format_html(
                '<img src="{}" style="max-height: 80px; border-radius: 4px;" />',
                os.environ.get("MEDIA_BASE_URL") + obj.variants["small"],
            )
        return "-"


@admin.register(PlaceDemo)
class PlaceDemoAdmin(TabbedTranslationAdmin):
    pass


@admin.register(ImageTagDemo)
class ImageTagDemoAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(ContentPageDemo)
class ContentPageDemoAdmin(TabbedTranslationAdmin):
    list_display = ("tag",)


@admin.register(RoomImageDemo)
class RoomImageDemoAdmin(admin.ModelAdmin):
    list_display = ("room", "order", "alt_text", "preview")
    fields = ["image_full", "room", "order", "alt_text"]
    readonly_fields = ("preview",)
    ordering = ("room", "order")

    def preview(self, obj):
        if obj.image_full:
            return format_html(
                '<img src="{}" style="max-height: 80px; border-radius: 4px;" />',
                obj.variants["small"],
            )
        return "-"

    preview.short_description = "Preview"


class RoomImageInline(admin.TabularInline):
    model = RoomImageDemo
    extra = 1
    fields = ("image_full", "alt_text", "order")
    ordering = ["order"]
    readonly_fields = ["preview"]

    def preview(self, obj):
        if obj.image_full:
            return f'<img id="test" src="{obj.image_full.url}" style="max-height: 100px; border-radius: 6px;" /><div>{obj.image_full.name}</div>'
        return ""

    preview.allow_tags = True
    preview.short_description = "Preview"
