from django.contrib import admin
from .models import ContentPage, Room, RoomImage
from modeltranslation.admin import TabbedTranslationAdmin
from django.utils.html import format_html



@admin.register(ContentPage)
class ContentPageAdmin(TabbedTranslationAdmin):
    pass



class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1
    fields = ('image', 'alt_text', 'order')
    ordering = ['order']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return f'<img id="test" src="{obj.image.url}" style="max-height: 100px; border-radius: 6px;" /><div>{obj.image.name}</div>'
        return ""
    
    preview.allow_tags = True
    preview.short_description = "Preview"


@admin.register(Room)
class RoomAdmin(TabbedTranslationAdmin):
    list_display = ('name', 'adults_num' )
    inlines = [RoomImageInline]

    def thumbnail(self, obj):
        first_img = obj.images.first()
        if first_img and first_img.image:
            return format_html(
                '<img src="{}" style="max-height: 60px; border-radius: 4px; display: inline-block" /><div>{}</div>',
                first_img.image.url

            )
        return "-"
    thumbnail.short_description = "Preview"

@admin.register(RoomImage)
class RoomImageAdmin(admin.ModelAdmin):
    list_display = ("room", "order", "image", "alt_text", "preview")
    readonly_fields = ("preview",)
    ordering = ("room", "order")

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; border-radius: 4px;" />',
                obj.image.url,
            )
        return "-"
    preview.short_description = "Preview"
