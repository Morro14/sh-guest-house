from django.test import TestCase as TestCaseDj
from django.contrib.auth import get_user_model
from .models import Room, RoomReserved
from .serializers import ReservationSerializer
from rest_framework.test import APITestCase
from .serializers import RoomSerializer
from datetime import date
from django.core.management import call_command
import random
from main.utils.room_price import get_reservation_price_total
from django.urls import reverse
from .views import reservation_price_view
from auth_app.utils.jwt_ import CustomJWT

# from rest_framework.request import Request
from requests import Request

User = get_user_model()


class ReservationTest(APITestCase):
    def setUp(self):
        call_command("seed")

    def test_get_price(self):
        rooms_all = Room.objects.all()
        res_rooms = rooms_all[0:2]
        res_rooms_guests = [
            {
                "slug": room.slug,
                "guests": {
                    "adults": random.randint(1, 5),
                    "children": random.randint(0, 3),
                },
            }
            for room in res_rooms
        ]
        nights = 2

        total_price = get_reservation_price_total(
            res_rooms, res_rooms_guests, nights
        )
        url = reverse(reservation_price_view)

        token = CustomJWT(
            content={
                "rooms_selected": res_rooms_guests,
                "request_info": {"nights": 2},
            }
        ).get_token()
        self.client.cookies["booking_request_token"] = token
        response = self.client.get(url)
