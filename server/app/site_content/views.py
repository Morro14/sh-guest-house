from rest_framework.views import APIView
from site_content.models import WideImage, Place, ContentPage
from main.models import Room
from rest_framework.response import Response
from django.utils.translation import gettext as _
from django.views.decorators.vary import vary_on_headers
from django.utils.decorators import method_decorator
from django.core.cache import cache
from django.conf import settings
from .serializers import (
    PlaceSerializer,
    RoomSerializer,
    ImageWideSerializer,
    ContentPageSerializer,
)
import os
import json
from django.utils import translation
from utils.language import _get_language_from_request


class WideImageSet(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, tag):
        images = WideImage.objects.filter(tag__name=tag)
        serializer = ImageWideSerializer(images, many=True)
        return Response({"data": serializer.data})


class RoomSetView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        rooms = Room.objects.prefetch_related("image").all()
        rooms_serial = RoomSerializer(rooms, many=True)
        return Response({"data": rooms_serial.data})


class PlaceSetView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        places = Place.objects.prefetch_related("image").all()
        place_serial = PlaceSerializer(places, many=True)
        return Response({"data": place_serial.data})


class PageContentView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        content_pages = ContentPage.objects.all()
        serializer = ContentPageSerializer(content_pages, many=True)
        return Response({"data": serializer.data})


class TranslationView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, lng=None):
        keys_path = os.path.join(
            settings.BASE_DIR, "site_content/translation.json"
        )
        keys = json.load(open(keys_path))

        lang = request.LANGUAGE_CODE
        cache_key = f"translations_{lang}_{settings.TRANSLATION_VERSION}"

        cached = cache.get(key=cache_key)
        if cached:
            return Response(cached)

        # translation.activate(lang)
        get_lang_value = translation.get_language()
        translations = {key: _(key) for key in keys}

        response = Response(translations)
        cache.set(cache_key, translations, timeout=60 * 60 * 24)
        return response
