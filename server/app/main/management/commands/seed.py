from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from main.models import Room, RoomImage, ContentPage
import random
from django.utils.translation import gettext_lazy as _


USER = get_user_model()

class Command(BaseCommand):
    help = "Populate database with Room, RoomImage and Content instances for tests"
    def add_arguments(self, parser):
        parser.add_argument("--rooms", type=int, default=7, help="Number of rooms")
        # parser.add_arguments("--images", type=int, default=random.randint(3,5), help="Number of images per room")

    def handle(self, *args, **options):
        for i in range(options["rooms"]):
            Room.objects.create(slug=f'room-{i}', name=f'Room {i}', adults_num=random.randint(2, 4), children_num=random.randint(0,2))
        rooms = Room.objects.all()
        for i in range(options["rooms"]):
            for j in range(random.randint(3,5)):
                RoomImage.objects.create(room=rooms[i], image_full='static/img/full/test_image.jpg', order=j)
        ContentPage.objects.create(slug='about', title_en='About the house', title_ru='О доме', body_en='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at scelerisque ante. Morbi efficitur porta lacus eget commodo. Suspendisse facilisis et neque eget feugiat. Vestibulum et tincidunt ex, nec posuere justo. Phasellus mollis libero sed arcu malesuada, vel lobortis lorem aliquam. Phasellus ut nisl ut dui aliquam hendrerit eu pretium massa. Nunc a malesuada tortor. Vestibulum sit amet lectus nibh. Praesent sit amet lorem ac mi maximus vulputate. Sed ac pharetra lorem. Fusce convallis leo lacus, in vulputate nibh aliquam porttitor.')
        # ContentPage.objects.create(slug='rooms-preview', title=_('Content_rooms_title'), body=_("Content_rooms_body"))
        self.stdout.write(self.style.SUCCESS("✅ Database seeded with fake data"))
