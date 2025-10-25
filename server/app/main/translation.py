from modeltranslation.translator import register, TranslationOptions 
from .models import ContentPage, Room


@register(ContentPage)
class ContentPageTranslationOptions(TranslationOptions):
	fields = ('title', 'body')

@register(Room)
class RoomTranslationOptions(TranslationOptions):
	fields = ('name', )