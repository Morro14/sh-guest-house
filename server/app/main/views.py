from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
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
from django.http import HttpResponse
from .queries import get_available_rooms
from .serializers import (
    RoomSerializer,
    PlaceSerializer,
    ImageWideSerializer,
    ReservationSerializer,
)
from .models import ContentPage, Room, Place, WideImage
from auth_app.utils.jwt_ import CustomJWT
from datetime import date, timedelta
from .authentication import SessionAuthentication
from main.utils.room_price import get_reservation_price_total
from .utils.data_parse import parse_rooms_selected
from .notifications.tasks import (
    send_on_reservation_validated,
    send_on_reservation_confirmed,
)
from utils.language import _get_language_from_request

load_dotenv()

User = get_user_model()


def template_test(request):
    if not settings.DEBUG:
        return HttpResponse(status=404)
    lang = _get_language_from_request(request)
    response = send_on_reservation_confirmed(res_pk="16")
    return response


class BookingRequestValidateView(APIView):
    permission_classes = []
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        is_valid = request.auth["request_validated"]
        response = Response()
        response.delete_cookie("booking_request_token")
        response.data = {"request_validated": is_valid}
        if is_valid:
            response.data.update({"user_email": request.auth["user_email"]})
        return response

    def post(self, request):
        token = request.COOKIES["booking_request_token"]
        jwt_content = jwt.decode(
            token, os.environ.get("JWT_SECRET"), "HS256"
        )

        check_in_date = date.fromisoformat(jwt_content["date"])
        nights_int = int(jwt_content["nights"])

        email = request.POST.get("email")
        guest_name = request.POST.get("guest-name")

        reservation_data = {
            "check_in": check_in_date,
            "check_out": check_in_date + timedelta(days=nights_int),
            "email": email,
            "guest_name": guest_name,
            "message": request.POST.get("client-message"),
        }
        serializer = ReservationSerializer(
            data=reservation_data,
            context={"token_content": jwt_content},
        )
        serializer.is_valid()
        reservation = serializer.save()
        no_overlap_valid = reservation.validate_no_overlap()
        if no_overlap_valid:
            send_on_reservation_validated.delay(no_overlap_valid.pk)
        token_data = request.auth
        token_data.update({"request_validated": True, "user_email": email})
        token = CustomJWT(content=token_data, expires_in=60 * 2).get_token()
        response = Response()
        response.delete_cookie("booking_request_token")
        response.set_cookie(
            key="booking_request_token",
            value=token,
            httponly=True,
            samesite="None",
            secure=True,
            path="/api/booking",
            max_age=60 * 2,
        )
        response.data = {"request_validated": True, "user_email": email}
        return response


class BookingRequestSummaryView(APIView):
    permission_classes = []
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        request_info = {
            k: v
            for k, v in request.auth.items()
            if k in ["date", "nights", "adults", "children"]
        }

        rooms_guests = request.auth["rooms_selected"]
        selected_room_slugs = [
            room["slug"] for room in request.auth["rooms_selected"]
        ]
        rooms = Room.objects.filter(slug__in=selected_room_slugs)
        reservation_price_total = get_reservation_price_total(
            rooms, rooms_guests, int(request_info["nights"])
        )

        serializer = RoomSerializer(data=rooms, many=True)
        serializer.is_valid()

        response = Response()
        response.data = {
            "request_info": request_info,
            "guests_per_room_selected": request.auth["rooms_selected"],
            "rooms": serializer.data,
            "price_total": reservation_price_total,
        }

        return response

    def post(self, request):
        request_info = {
            k: v
            for k, v in request.auth.items()
            if k in ["date", "nights", "adults", "children"]
        }

        rooms_selected = parse_rooms_selected(request)
        request_info.update({"rooms_selected": rooms_selected})
        token_updated = CustomJWT(
            # TEST
            content=request_info,
            expires_in=60 * 15,
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
            data.get("date"), data.get("nights")
        )
        serializer = RoomSerializer(available_rooms, many=True)
        token_content = {
            "date": data.get("date"),
            "nights": data.get("nights"),
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


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([])
def reservation_price_view(request):
    if request.method == "POST":
        rooms_guests = parse_rooms_selected(request)
        nights = request.auth["nights"]

        selected_room_slugs = [room["slug"] for room in rooms_guests]
        rooms = Room.objects.filter(slug__in=selected_room_slugs)
        reservation_price_total = get_reservation_price_total(
            rooms, rooms_guests, int(nights)
        )
        response = Response(
            data={"reservation_price": reservation_price_total}
        )

        return response


class WideImageSet(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, tag):
        images = WideImage.objects.filter(tag__name=tag)
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
