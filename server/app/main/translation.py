from modeltranslation.translator import register, TranslationOptions
from .models import ContentPage, Room, Place


@register(ContentPage)
class ContentPageTranslationOptions(TranslationOptions):
    fields = ("title", "body")


@register(Room)
class RoomTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(Place)
class PlaceTranslationOptions(TranslationOptions):
    fields = ("name", "distance_comment", "description", "info_link")

