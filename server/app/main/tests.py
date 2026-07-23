from django.test import TestCase
from .models import RoomReserved, Room, Reservation
from datetime import datetime
from .queries import get_available_rooms
from django.conf import settings
from .notifications.tasks import send_to_client, send_task_async
from django.template import Context, Template
import structlog
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model


class RoomResTest(TestCase):
    def setUp(self):
        room = Room.objects.create(
            name="Room",
            slug="room",
            beds="beds description",
            description="room description",
            adults_num=2,
            children_num=0,
        )
        created_at = datetime.now()
        check_in = datetime(2026, 7, 26)
        check_out = datetime(2026, 7, 28)
        res_one = Reservation.objects.create(
            status="confirmed",
            created_at=created_at,
            guest_name="Victorino",
            check_in=check_in,
            check_out=check_out,
            email="test@email.com",
            message="123",
        )
        res_two = Reservation.objects.create(
            status="requested",
            created_at=created_at,
            guest_name="Simon",
            check_in=check_in,
            check_out=check_out,
            email="test2@email.com",
            message="123",
        )
        RoomReserved.objects.create(
            room=room, reservation=res_one, adults=2, children=0
        )
        RoomReserved.objects.create(
            room=room, reservation=res_two, adults=2, children=0
        )

    def test_overlap(self):
        # print(
        #     "reservation.confrimed same room",
        #     Reservation.confirmed.filter(room__slug="room"),
        # )
        res_two = Reservation.objects.filter(status="requested").first()
        room = Room.objects.get(slug="room")
        RoomReserved.objects.create(
            room=room, reservation=res_two, adults=2, children=0
        )
        res_three = Reservation.objects.create(
            status="requested",
            created_at="2026-07-29",
            guest_name="Simon",
            check_in=datetime(2026, 9, 29),
            check_out=datetime(2026, 9, 30),
            email="test2@email.com",
            message="123",
        )
        RoomReserved.objects.create(
            room=room, reservation=res_three, adults=1, children=0
        )
        self.assertFalse(res_two.validate_no_overlap(), "overlap exists")
        self.assertTrue(res_three.validate_no_overlap(), "overlap doesn't exists")
        # print(res_two.validate_no_overlap())

    def test_get_available_rooms(self):
        res_two = Reservation.objects.get(guest_name="Simon")
        check_in_free = datetime(2026, 7, 29)
        available_rooms = get_available_rooms(check_in_str="2026-07-29", nights=1)
        print(available_rooms)


class SendEmailTest(APITestCase):
    def setUp(self):

        created_at = datetime.now()
        check_in = datetime(2026, 7, 26)
        check_out = datetime(2026, 7, 28)
        self.reservation = Reservation.objects.create(
            status="confirmed",
            created_at=created_at,
            guest_name="Victorino",
            check_in=check_in,
            check_out=check_out,
            email="test@email.com",
            message="123",
        )
        User = get_user_model()
        self.user = User.objects.create_superuser(
            email="ivfmn2@gmail.com",
            password="password123",
            is_active=True,
            is_staff=True,
        )
        self.client.force_login(self.user)

    # def test_on_decline(self):
    #     response = self.client.post("/admin/main/reservation/1/decline123123")
    #
    def test_on_decline_valid_url(self):
        print("USER PERMISSIONS", self.user.user_permissions)
        url = f"/admin/main/reservation/{self.reservation.id}/decline/"
        response = self.client.post(url)
        if response.status_code == 302:
            print("Redirecting to:", response.headers.get("Location"))

        # 2. Add an explicit assertion (expecting 200 OK or 302 Redirect)
        self.assertIn(response.status_code, [200, 302])

    def test_on_decline_invalid_url(self):
        # 3. Asserting that a wrong URL returns a 404 response status code
        response = self.client.get("/admin/main/reservation/invalid-id/decline/")
        if response.status_code == 302:
            print("Redirecting to:", response.headers.get("Location"))
        self.assertEqual(response.status_code, 404)  #     print(response)
