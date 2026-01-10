from django.test import TestCase as TestCaseDj
from django.contrib.auth import get_user_model
from .models import Room, RoomReserved
from .serializers import ReservationSerializer
from rest_framework.test import APITestCase
from .serializers import RoomSerializer
from datetime import date
from django.core.management import call_command


User = get_user_model()


class ReservationTest(APITestCase):
    def setUp(self):
        call_command("seed")

    def test_create(self):
        check_in = date(2025, 12, 25)
        check_out = date(2025, 12, 28)
        rooms = Room.objects.all()
        print("room slug", rooms[0].slug)
        serializer_data = {
            "check_in": check_in,
            "check_out": check_out,
            "email": "test@email.com",
        }

        rooms_context = [
            {"slug": rooms[0].slug, 'guests': {"adults": 2, "children": 0}},
            {"slug": rooms[1].slug, 'guests': {"adults": 3, "children": 2}},
        ]
        serializer = ReservationSerializer(
            data=serializer_data, context={
                "token_content": {"rooms_selected": rooms_context}}
        )
        serializer.is_valid()
        print("serializer errors:", serializer.errors)
        reservation = serializer.save()
        reservation.validate_no_overlap()
        # print(
        #     "rooms reserved _:",
        #     RoomReserved.objects.all(),
        # )
        print(
            "test reservation:",
            reservation,
            "\nrooms reserved: ",
            reservation.rooms_reserved.all(),
            "\nstatus:",
            reservation.status,
            "\nemail:",
            reservation.email,
        )
