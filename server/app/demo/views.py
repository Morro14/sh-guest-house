from rest_framework.response import Response
from django.utils.translation import gettext as _
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination
from django.db.models import Prefetch
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from dotenv import load_dotenv
import os
from django.conf import settings
import json
import jwt
from .queries import get_available_rooms
from .serializers import (
    RoomSerializer,
    ReservationSerializer,
)
from .serializers import (
    PlaceSerializer,
    RoomSerializer,
    ImageWideSerializer,
    ContentPageSerializer,
    ImageGridSerializer,
    ReviewSerializer,
)
from django.views.generic import TemplateView
from auth_app.utils.jwt_ import CustomJWT
from datetime import date, timedelta
from .authentication import SessionAuthentication
from main.utils.room_price import get_reservation_price_total
from main.utils.data_parse import parse_rooms_selected
import structlog
import uuid

from .models import (
    ImageTagDemo,
    ContentPageDemo,
    ReservationDemo,
    RoomReservedDemo,
    RoomDemo,
    WideImageDemo,
    GridImageDemo,
    RoomImageDemo,
    ImageGridDemo,
    PlaceDemo,
    PlaceImageDemo,
    ReviewDemo,
)

load_dotenv()
log = structlog.get_logger()


# def template_test(request):
#     # if not settings.DEBUG:
#     #     return HttpResponse(status=404)
#     # res = Reservation.objects.get(pk=1)
#     translation.activate("ru")
#     subject, html_body, text_body = get_res_validated_mail_content(1)
#
#     return HttpResponse(html_body)


class BookingRequestValidateView(APIView):
    permission_classes = []
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        is_valid = request.auth["request_validated"]
        response = Response()
        response.data = {"request_validated": is_valid}
        if is_valid:
            response.data.update({"user_email": request.auth["user_email"]})
        return response

    def post(self, request):
        token = request.COOKIES["booking_request_token"]
        jwt_content = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        jti = request.auth["jti"]
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
        if not no_overlap_valid:
            log.warning("request_not_validated", user_email=email)
        token_data = request.auth
        token_data.update({"request_validated": True, "user_email": email})
        token = CustomJWT(
            content=token_data,
            expires_in=60 * 15,
            jti=jti,
        ).get_token()
        response = Response()
        response.data = {
            "request_validated": True,
            "user_email": email,
        }
        log.info("request_validated", user_email=email)
        return response


class BookingRequestSummaryView(APIView):
    permission_classes = []
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        booking_request_info = {
            k: v
            for k, v in request.auth.items()
            if k in ["date", "nights", "adults", "children"]
        }
        jti = request.auth["jti"]
        rooms_guests = request.auth["rooms_selected"]
        selected_room_slugs = [room["slug"] for room in request.auth["rooms_selected"]]
        rooms = RoomDemo.objects.filter(slug__in=selected_room_slugs)
        reservation_price_total = get_reservation_price_total(
            rooms, rooms_guests, int(booking_request_info["nights"])
        )

        serializer = RoomSerializer(data=rooms, many=True)
        serializer.is_valid()

        response = Response()
        response.data = {
            "request_info": booking_request_info,
            "guests_per_room_selected": request.auth["rooms_selected"],
            "rooms": serializer.data,
            "price_total": reservation_price_total,
        }

        log.info(
            "request_summary_view",
            session_id=jti,
            price_total=reservation_price_total,
            date=booking_request_info["date"],
            nights=booking_request_info["nights"],
            guests=int(booking_request_info["adults"])
            + int(booking_request_info["children"]),
        )
        return response

    def post(self, request):
        booking_request_info = {
            k: v
            for k, v in request.auth.items()
            if k in ["date", "nights", "adults", "children"]
        }
        jti = request.auth["jti"]
        rooms_selected = parse_rooms_selected(request)
        booking_request_info.update({"rooms_selected": rooms_selected})
        token_updated = CustomJWT(
            content=booking_request_info, expires_in=60 * 15, jti=jti
        ).get_token()

        response = Response()
        response.delete_cookie("booking_request_token")
        response.data = {
            "rooms_selected": rooms_selected,
            "request_info": booking_request_info,
            "booking_request_token": token_updated,
        }

        log.info(
            "request_summary_view",
            session_id=jti,
            date=booking_request_info["date"],
            nights=booking_request_info["nights"],
            guests=int(booking_request_info["adults"])
            + int(booking_request_info["children"]),
        )
        return response


class BookingRoomsRequestView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        data = request.GET
        available_rooms = get_available_rooms(data.get("date"), data.get("nights"))
        serializer = RoomSerializer(available_rooms, many=True)
        booking_request_info = {
            "date": data.get("date"),
            "nights": data.get("nights"),
            "adults": data.get("adults"),
            "children": data.get("children"),
        }
        jti = str(uuid.uuid4())
        token = CustomJWT(
            secret=os.environ.get("JWT_SECRET"),
            content=booking_request_info,
            expires_in=20 * 60,
            jti=jti,
        ).get_token()
        response = Response()
        response.data = {
            "rooms": serializer.data,
            "reserv_request_info": booking_request_info,
            "booking_request_token": token,
        }
        log.info(
            "rooms_requested",
            session_id=jti,
            date=booking_request_info["date"],
            nights=booking_request_info["nights"],
            guests=int(booking_request_info["adults"])
            + int(booking_request_info["children"]),
        )
        return response


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
# @authentication_classes([])
@permission_classes([])
def reservation_price_view(request):
    if request.method == "POST":
        rooms_guests = parse_rooms_selected(request)
        nights = request.auth["nights"]
        selected_room_slugs = [room["slug"] for room in rooms_guests]
        rooms = RoomDemo.objects.filter(slug__in=selected_room_slugs)
        reservation_price_total = get_reservation_price_total(
            rooms, rooms_guests, int(nights)
        )
        response = Response(data={"reservation_price": reservation_price_total})

        return response


class FrontendLogsView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):

        data_serialized = json.loads(request.data.get("data"))
        log.error(
            "frontend_error",
            **data_serialized,
            # request_id=getattr(request, "request_id", None),
        )

        return Response({"message": "ok"})


class HealthCheckView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        return Response({"message": "Health check response"})


class FrontendView(TemplateView):
    template_name = "index.html"


class WideImageSet(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, tag):
        images = WideImageDemo.objects.filter(tag__name=tag).order_by("order")
        serializer = ImageWideSerializer(images, many=True)
        return Response({"data": serializer.data})


class ImageGridSet(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        tag = request.GET.get("tag")
        if tag:
            grids = ImageGridDemo.objects.prefetch_related("grid_image").filter(
                tag__name=tag
            )
        else:
            grids = ImageGridDemo.objects.prefetch_related("grid_image").all()
        serializer = ImageGridSerializer(grids, many=True)
        return Response({"data": serializer.data})


class RoomSetView(ListAPIView):
    permission_classes = []
    authentication_classes = []
    serializer_class = RoomSerializer
    images = RoomImageDemo.objects.order_by("order")
    queryset = (
        RoomDemo.objects.prefetch_related(Prefetch("image", queryset=images))
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
        places = PlaceDemo.objects.prefetch_related("image").all()
        place_serial = PlaceSerializer(places, many=True)
        return Response({"data": place_serial.data})


class PageContentView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        content_pages = ContentPageDemo.objects.all()
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
        print("TRANSLATIONS", "version:", cache_key, translations)
        response = Response(translations)
        cache.set(cache_key, translations, timeout=60 * 60 * 24)
        print("sending fresh translations")
        return response


class ReviewView(viewsets.ReadOnlyModelViewSet):
    permission_classes = []
    authentication_classes = []

    queryset = ReviewDemo.objects.all()
    serializer_class = ReviewSerializer
    pagination_class = LimitOffsetPagination


review_details = ReviewView.as_view({"get": "retrieve"})
review_list = ReviewView.as_view({"get": "list"})
