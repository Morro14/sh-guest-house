from django.test import TestCase as TestCaseDj
from django.contrib.auth import get_user_model
from .models import Reservation, ContentPage, Room, RoomImage
from rest_framework.test import APITestCase
from .serializers import RoomSerializer


User = get_user_model()


class ImageTest(APITestCase):
    def setUp(self):
        for i in range(3):
            Room.objects.create(slug=f'room-{i}', name=f"Room {i}", adults_num=3, children_num=0)
        rooms = Room.objects.all()
        
        for i in range(9):
            RoomImage.objects.create(alt_text=f'room-{i}', order=i, image_full='static/img/full/20250717_192551.jpg', room=rooms[0] if i in range(0,3) else rooms[1] if i in range(3,6) else rooms[2] )

    def test_get_room_images(self):
        rooms = Room.objects.prefetch_related('image').all()
        # print('related set', rooms[0].images_set.all())

        rooms_serial = RoomSerializer(rooms, many=True)
        print('rooms data',rooms_serial.data)

        
        