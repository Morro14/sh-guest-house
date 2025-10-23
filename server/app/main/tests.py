from django.test import TestCase as TestCaseDj
from django.contrib.auth import get_user_model
from auth_app.utils.jwt_ import CustomJWTTest
from django.core.management import call_command
from .models import Reservation
User = get_user_model()
from datetime import date
from .models import Room
from django.db.models import OuterRef, Exists, Q


class CurrentTest(TestCaseDj):
    def setUp(self):

        pass
    
    def test_res_overlap(self):
        user = User.objects.create_user(email="test@email.com", password="password123")
        room1 = Room.objects.create(name="Room 1", adults_num=2, children_num=0)
        room2 = Room.objects.create(name="Room 2", adults_num=3, children_num=1)

        r1 = Reservation.objects.create(user=user, check_in="2025-10-20", check_out="2025-10-25", rooms=[room1])
        # r1.rooms.add(room1)

        r2 = Reservation(user=user, check_in="2025-10-27", check_out="2025-10-26", rooms=[room1])
        r2.save() 

    def test_get_available_rooms(self):
        check_in = date.fromisoformat('2025-10-25')
        check_out = date.fromisoformat('2025-10-26')

        room1 = Room.objects.create(name="Room 1", adults_num=2, children_num=0)
        room2 = Room.objects.create(name="Room 2", adults_num=3, children_num=1)
        r1 = Reservation.objects.create(check_in="2025-10-25", check_out="2025-10-26", rooms=[room1])
        # r2 = Reservation.objects.create(check_in="2025-10-25", check_out="2025-10-27", rooms=[room1])
        overlapping_res = Reservation.objects.filter(rooms=OuterRef('pk'),check_in__lt=check_out, check_out__gt=check_in)
        available_rooms = Room.objects.annotate(is_reserved=Exists(overlapping_res)).filter(is_reserved=False)

        # print('overlapping_res',overlapping_res) 
        print('available rooms',available_rooms)

