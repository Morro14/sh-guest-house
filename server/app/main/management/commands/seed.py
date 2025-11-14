from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from main.models import (
    Room,
    RoomImage,
    ContentPage,
    WideImage,
)
import random
from django.utils.translation import gettext_lazy as _
from django.db.utils import IntegrityError
from faker import Faker


USER = get_user_model()
fake = Faker()

content_data = [
    {
        "slug": "about",
        "title": "About the house",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at scelerisque ante. Morbi efficitur porta lacus eget commodo. Suspendisse facilisis et neque eget feugiat. Vestibulum et tincidunt ex, nec posuere justo. Phasellus mollis libero sed arcu malesuada, vel lobortis lorem aliquam. Phasellus ut nisl ut dui aliquam hendrerit eu pretium massa. Nunc a malesuada tortor. Vestibulum sit amet lectus nibh. Praesent sit amet lorem ac mi maximus vulputate. Sed ac pharetra lorem. Fusce convallis leo lacus, in vulputate nibh aliquam porttitor.",
    },
    {
        "slug": "rooms-preview",
        "title": "Rooms",
        "body": "Maecenas dui purus, tempus et tristique a, imperdiet eu quam. Mauris vitae elit sem. Integer tincidunt, nunc sit amet sodales molestie, elit metus laoreet augue, sit amet tristique risus risus nec magna.",
    },
]


class Command(BaseCommand):
    help = "Populate database with Room, RoomImage and Content instances for tests"

    def add_arguments(self, parser):
        parser.add_argument(
            "--rooms", type=int, default=7, help="Number of rooms"
        )
        # parser.add_argument(
        #     "--content",
        #     type=bool,
        #     default=False,
        #     help="Generate content pages or not",
        # )
        parser.add_argument(
            "--images",
            type=int,
            default=random.randint(3, 5),
            help="Number of images per room",
        )

    def handle(self, *args, **options):
        def add_rooms():
            for i in range(options["rooms"]):
                try:
                    Room.objects.create(
                        slug=f"room-{i}",
                        name=f"Room {i}",
                        adults_num=random.randint(2, 4),
                        children_num=random.randint(0, 2),
                        beds=fake.text(),
                    )
                except IntegrityError:
                    continue

        # add_rooms()

        def add_room_images():
            rooms = Room.objects.all()
            for i in range(options["rooms"] or len(rooms)):
                for j in range(random.randint(3, 5)):
                    try:
                        RoomImage.objects.create(
                            room=rooms[i],
                            image_full="static/img/full/test_image.jpg",
                            order=j,
                        )
                    except IntegrityError:
                        continue

        def add_content():
            if options["content"]:
                for c in content_data:
                    try:
                        ContentPage.objects.create(
                            slug=c["slug"],
                            title_en=c["title"],
                            body_en=c["body"],
                        )
                    except IntegrityError:
                        continue

        def add_wide_images():
            WideImage.objects.create(
                original="static/img/full/full-1.png",
                alt_text="wide-image-1",
                image_full="static/img/full/wide-photo-1.png",
            )

        add_wide_images()
        add_room_images()

        self.stdout.write(
            self.style.SUCCESS("✅ Database seeded with fake data")
        )
