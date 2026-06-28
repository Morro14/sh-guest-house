from django.db.models import Prefetch
from rest_framework.views import APIView
from site_content.models import (
    WideImage,
    Place,
    ContentPage,
    GridImage,
    Review,
    RoomImage,
)
from main.models import Room
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination
from django.utils.translation import gettext as _
from django.core.cache import cache
from django.conf import settings
from .serializers import (
    PlaceSerializer,
    RoomSerializer,
    ImageWideSerializer,
    ContentPageSerializer,
    ImageGridSerializer,
    ReviewSerializer,
)
from django.views.generic import TemplateView
import os
import json
from django.utils import translation


class FrontendView(TemplateView):
    template_name = "index.html"


class WideImageSet(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, tag):
        images = WideImage.objects.filter(tag__name=tag).order_by("order")
        serializer = ImageWideSerializer(images, many=True)
        return Response({"data": serializer.data})


class GridImageSet(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        tag = request.GET.get("tag")
        if tag:
            images = GridImage.objects.filter(tag__name=tag)
        else:
            images = GridImage.objects.all()
        serializer = ImageGridSerializer(images, many=True)
        return Response({"data": serializer.data})


class RoomSetView(ListAPIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = RoomSerializer
    images = RoomImage.objects.order_by("order")
    queryset = (
        Room.objects.prefetch_related(Prefetch("image", queryset=images))
        .all()
        .order_by("slug")
    )
    pagination_class = LimitOffsetPagination

    # def list(self, request, *args, **kwargs):
    #     list_response = super().list(request, *args, **kwargs)
    #     return Response({"data": list_response.data})


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
        lang = request.LANGUAGE_CODE.lower()[:2]
        keys = list(json.load(open((f"locale/{lang}/frontend_keys.json"))))
        cache_key = f"translations_{lang}_{settings.TRANSLATION_VERSION}"

        cached = cache.get(key=cache_key)
        if cached:
            print("sending chached translations")
            return Response(cached)

        translations = {key: _(key) for key in keys}
        response = Response(translations)
        cache.set(cache_key, translations, timeout=60 * 60 * 24)
        print("sending fresh translations")
        return response


class ReviewView(viewsets.ReadOnlyModelViewSet):
    permission_classes = []
    authentication_classes = []

    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    pagination_class = LimitOffsetPagination


review_details = ReviewView.as_view({"get": "retrieve"})
review_list = ReviewView.as_view({"get": "list"})
