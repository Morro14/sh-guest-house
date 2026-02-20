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

    @method_decorator(vary_on_headers("Accept-Language"), name="dispatch")
    def get(self, request):
        keys_path = os.path.join(
            settings.BASE_DIR, "site_content/translation.json"
        )
        keys = json.load(open(keys_path))

        lang = self._get_language_from_request(request=request)
        cache_key = f"translations_{lang}_{settings.TRANSLATION_VERSION}"
        print("request language:", lang)

        cached = cache.get(key=cache_key)
        if cached:
            print("sending cached response")
            return Response(cached)

        translation.activate(lang)
        translations = {key: _(key) for key in keys}

        # add model translations
        # content_instances = ContentPage.objects.all()
        # content_formatted = {
        #     c.slug: {"title": c.title, "body": c.body, "slug": c.slug}
        #     for c in content_instances
        # }
        # translations.update(content_formatted)
        # place_instances = Place.objects.all()
        # places_formatted = {
        #     p.slug: {
        #         "name": p.name,
        #         "description": p.description,
        #         "info_link": p.info_link,
        #     }
        #     for p in place_instances
        # }
        # translations.update({"places": places_formatted})

        response = Response(translations)
        print("setting cache")
        cache.set(cache_key, translations, timeout=60 * 60 * 24)
        return response

    def _get_language_from_request(self, request):
        # Explicit ?lang= parameter takes priority
        if lang := request.GET.get("lang"):
            print("detecting lang from request")
            return lang

        # Then check the Accept-Language header
        header = request.META.get("HTTP_ACCEPT_LANGUAGE", "")
        if header:
            # Example header: "ru,en;q=0.8,hy;q=0.5"
            langs = [h.split(";")[0].strip() for h in header.split(",")]
            for lang in langs:
                short = lang.split("-")[0]
                if short in dict(settings.LANGUAGES):
                    return short

        # Fallback
        return settings.LANGUAGE_CODE
