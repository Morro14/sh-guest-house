from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework import exceptions
from dotenv import load_dotenv
import os
import json
import jwt
from .queries import get_available_rooms
from .serializers import (
    RoomSerializer,
    ReservationSerializer,
)
from .models import Room
from auth_app.utils.jwt_ import CustomJWT
from datetime import date, timedelta
from .authentication import SessionAuthentication
from main.utils.room_price import get_reservation_price_total
from .utils.data_parse import parse_rooms_selected
import structlog
import uuid

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
        response.delete_cookie("booking_request_token")
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
        overlap_check = reservation.validate_no_overlap()
        token_data = request.auth
        if not overlap_check:
            log.warning("request_not_validated", user_email=email)
            token_data.update({"request_validated": False, "user_email": email})
            token = CustomJWT(
                content=token_data,
                expires_in=60 * 15,
                jti=jti,
            ).get_token()
            response = Response(exception=True, status=500)
            response.set_cookie(
                key="booking_request_token",
                value=token,
                httponly=True,
                # samesite="Lax",
                # secure=True,
                path="/api/booking",
                max_age=60 * 15,
            )
            response.data = {"request_validated": False, "user_email": email}
            return response
        token_data = request.auth
        token_data.update({"request_validated": True, "user_email": email})
        token = CustomJWT(
            content=token_data,
            expires_in=60 * 15,
            jti=jti,
        ).get_token()
        response = Response()
        response.set_cookie(
            key="booking_request_token",
            value=token,
            httponly=True,
            # samesite="Lax",
            # secure=True,
            path="/api/booking",
            max_age=60 * 15,
        )
        response.data = {"request_validated": True, "user_email": email}
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
        rooms = Room.objects.filter(slug__in=selected_room_slugs)
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
        response.set_cookie(
            key="booking_request_token",
            value=token_updated,
            httponly=True,
            # samesite="Lax",
            # secure=True,
            path="/api/booking",
            max_age=60 * 15,
        )
        response.data = {
            "rooms_selected": rooms_selected,
            "request_info": booking_request_info,
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
        response.set_cookie(
            key="booking_request_token",
            value=token,
            httponly=True,
            # samesite="Lax",
            # secure=False,
            path="/api/booking",
            max_age=20 * 60,
        )
        response.data = {
            "rooms": serializer.data,
            "reserv_request_info": booking_request_info,
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
        rooms = Room.objects.filter(slug__in=selected_room_slugs)
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
