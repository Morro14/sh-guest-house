from django.contrib import admin
from .models import (
    ContentPage,
    Room,
    RoomImage,
    Place,
    PlaceImage,
    WideImage,
    Reservation,
    RoomReserved,
    ImageTag
)
from modeltranslation.admin import TabbedTranslationAdmin
from django.utils.html import format_html


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    pass


@admin.register(WideImage)
class WideImageAmin(admin.ModelAdmin):
    fields = ['alt_text', 'order', 'image_full', 'tag']


# @admin.register(OriginalImage)
# class OriginalImageAdmin(admin.ModelAdmin):
#     # fields = ["wide_image"]
#     pass


@admin.register(PlaceImage)
class PlaceImageAdmin(admin.ModelAdmin):
    fields = ['alt_text', 'order', 'image_full', 'place']


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    pass


@admin.register(ImageTag)
class ImageTagAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(ContentPage)
class ContentPageAdmin(TabbedTranslationAdmin):
    list_display = ("slug",)


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


@admin.register(RoomImage)
class RoomImageAdmin(admin.ModelAdmin):
    list_display = ("room", "order", "alt_text", "preview")
    fields = ["image_full", "room", "order", "alt_text"]
    readonly_fields = ("preview",)
    ordering = ("room", "order")

    def preview(self, obj):
        if obj.image_full:
            return format_html(
                '<img src="{}" style="max-height: 80px; border-radius: 4px;" />',
                obj.image_full.url,
            )
        return "-"

    preview.short_description = "Preview"


class RoomImageInline(admin.TabularInline):
    model = RoomImage
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
