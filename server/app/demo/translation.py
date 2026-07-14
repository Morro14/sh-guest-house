from modeltranslation.translator import register, TranslationOptions
from .models import ContentPageDemo, PlaceDemo, RoomDemo


@register(ContentPageDemo)
class ContentPageDemoTranslationOptions(TranslationOptions):
    fields = ("title", "body")


@register(RoomDemo)
class RoomDemoTranslationOptions(TranslationOptions):
    fields = ("name",)


@register(PlaceDemo)
class PlaceDemoTranslationOptions(TranslationOptions):
    fields = ("name", "distance_comment", "description", "info_link")
