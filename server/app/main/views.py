from rest_framework.response import Response
from rest_framework.views import APIView
from dotenv import load_dotenv
from django.contrib.auth import get_user_model
from django.utils import translation
from django.conf import settings
import os
import re
import json
import jwt
from django.utils.translation import gettext as _
from django.views.decorators.vary import vary_on_headers
from django.utils.decorators import method_decorator
from django.core.cache import cache
from .queries import get_available_rooms
from .serializers import (
    RoomSerializer,
    PlaceSerializer,
    ImageWideSerializer,
    ReservationSerializer,
)
from .models import Reservation, ContentPage, Room, Place, WideImage
from collections import defaultdict
from auth_app.utils.jwt_ import CustomJWT
from datetime import date, timedelta
from .authentication import SessionAuthentication

load_dotenv()

User = get_user_model()


class BookingRequestValidateView(APIView):
    permission_classes = []
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        token = request.COOKIES["booking_request_token"]
        jwt_content = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        # print("jwt_content", jwt_content)

        check_in_date = date.fromisoformat(jwt_content["date"])
        days_int = int(jwt_content["days"])

        email = request.POST.get("email")
        reservation_data = {
            "check_in": check_in_date,
            "check_out": check_in_date + timedelta(days=days_int),
            "email": email,
        }
        serializer = ReservationSerializer(
            data=reservation_data,
            context={"token_content": jwt_content},
        )
        serializer.is_valid()
        # print("serializer errors", serializer.errors)
        reservation = serializer.save()
        reservation.validate_no_overlap()
        response = Response()
        response.data = {"request_validated": True, "user_email": email}
        response.delete_cookie(
            key="booking_request_token", path="/api/booking"
        )
        return response


class BookingRequestSummaryView(APIView):
    permission_classes = []
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        request_info = {
            k: v
            for k, v in request.auth.items()
            if k in ["date", "days", "adults", "children", "rooms_selected"]
        }

        response = Response()
        response.data = {"request_info": request_info}
        return response

    def post(self, request):
        data = list(request.POST.items())
        print('data', data)
        rooms = defaultdict(dict)
        rooms_selected = []
        request_info = {
            k: v
            for k, v in request.auth.items()
            if k in ["date", "days", "adults", "children"]
        }
        for key, value in data:
            match = re.match(r"\[(.+)\]\[(.+)\]", key)
            if match and value.isdigit():
                room_slug, guest_type = match.groups()
                rooms[room_slug][guest_type] = int(value)

        for key in rooms.keys():
            if rooms[key]["adults"] != 0 or rooms[key]["children"] != 0:
                rooms_selected.append({"slug": key, "guests": rooms[key]})

        print('rooms_selected', rooms_selected)
        request_info.update({"rooms_selected": rooms_selected})
        token_updated = CustomJWT(
            content=request_info, expires_in=60 * 15
        ).get_token()

        response = Response()
        response.set_cookie(
            key="booking_request_token",
            value=token_updated,
            httponly=True,
            samesite="None",
            secure=True,
            path="/api/booking",
            max_age=60 * 15,
        )
        response.data = {
            "rooms_selected": rooms_selected,
            "request_info": request_info,
        }
        return response


class BookingRoomsRequestView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        data = request.GET
        available_rooms = get_available_rooms(
            data.get("date"), data.get("days")
        )
        serializer = RoomSerializer(available_rooms, many=True)
        token_content = {
            "date": data.get("date"),
            "days": data.get("days"),
            "adults": data.get("adults"),
            "children": data.get("children"),
        }

        token = CustomJWT(
            secret=os.environ.get("JWT_SECRET"),
            content=token_content,
            expires_in=60 * 15,
        ).get_token()
        response = Response()

        response.set_cookie(
            key="booking_request_token",
            value=token,
            httponly=True,
            samesite="None",
            secure=True,
            path="/api/booking",
            max_age=60 * 15,
        )
        response.data = {
            "rooms": serializer.data,
            "reserv_request_info": token_content,
        }
        return response


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


class WideImageSet(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        images = WideImage.objects.all()
        serializer = ImageWideSerializer(images, many=True)
        data = serializer.data
        return Response({"data": data})


class TranslationView(APIView):
    permission_classes = []
    authentication_classes = []

    @method_decorator(vary_on_headers("Accept-Language"), name="dispatch")
    def get(self, request):
        keys_path = os.path.join(settings.BASE_DIR, "main/translation.json")
        keys = json.load(open(keys_path))

        lang = self._get_language_from_request(request=request)
        cache_key = f"translations_{lang}_{settings.TRANSLATION_VERSION}"

        cached = cache.get(key=cache_key)
        if cached:
            print("sending cached response")
            return Response(cached)

        translation.activate(lang)
        translations = {key: _(key) for key in keys}

        # add model translations
        content_instances = ContentPage.objects.all()
        content_formatted = {
            c.slug: {"title": c.title, "body": c.body, "slug": c.slug}
            for c in content_instances
        }
        translations.update(content_formatted)

        response = Response(translations)
        print("setting cache")
        cache.set(cache_key, translations, timeout=60 * 60 * 24)
        return response

    def _get_language_from_request(self, request):
        # Explicit ?lang= parameter takes priority
        if lang := request.GET.get("lang"):
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
