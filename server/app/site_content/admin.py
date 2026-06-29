from django.contrib import admin

from .models import (
    ContentPage,
    RoomImage,
    Place,
    PlaceImage,
    WideImage,
    ImageTag,
    GridImage,
    ImageGrid,
    Review,
)

from modeltranslation.admin import TabbedTranslationAdmin
from django.utils.html import format_html


@admin.register(Review)
class ReviewAmin(admin.ModelAdmin):
    list_display = ("date", "rating", "content")
    pass


@admin.register(WideImage)
class WideImageAmin(admin.ModelAdmin):
    fields = ["alt_text", "order", "image_full", "tag"]


@admin.register(ImageGrid)
class ImageGridAdmin(admin.ModelAdmin):
    list_display = ["index", "pk"]


@admin.register(GridImage)
class GridImageAmin(admin.ModelAdmin):
    pass
    # fields = ["alt_text", "grid", "order", "image_full", "tag", "format_in_grid"]
    # list_display = ["format_in_grid", "grid", "alt_text", "image_full"]
    # ordering = ("grid", "format_in_grid")
    # list_filter = ["grid"]


@admin.register(PlaceImage)
class PlaceImageAdmin(admin.ModelAdmin):
    fields = ["alt_text", "order", "image_full", "place"]
    list_display = ("place", "order", "image_full")
    list_filter = ["place__name"]
    ordering = ("place", "order")


@admin.register(Place)
class PlaceAdmin(TabbedTranslationAdmin):
    pass


@admin.register(ImageTag)
class ImageTagAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(ContentPage)
class ContentPageAdmin(TabbedTranslationAdmin):
    list_display = ("tag",)


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
