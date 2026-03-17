from django.core.management.base import BaseCommand
from site_content.models import (
    RoomImage,
)
from main.models import Room
import random
from django.db.utils import IntegrityError
from faker import Faker
import os
from django.core.files import File
from django.conf import settings

fake = Faker()


class Command(BaseCommand):
    help = "Populate database with Room, RoomImage and Content instances for tests"

    def add_arguments(self, parser):
        parser.add_argument(
            "--rooms", type=int, default=7, help="Number of rooms"
        )
        parser.add_argument(
            "--images",
            type=int,
            default=random.randint(3, 5),
            help="Number of images per room",
        )

    def handle(self, *args, **options):
        if Room.objects.exists():
            self.stdout.write(
                self.style.SUCCESS(
                    "Skipping generating data for Room. Room already exist."
                )
            )
            return

        def add_rooms():
            for i in range(options["rooms"]):
                try:
                    Room.objects.create(
                        slug=f"room-{i}",
                        name=f"Room {i}",
                        adults_num=random.randint(2, 4),
                        children_num=random.randint(0, 2),
                        beds=fake.text(),
                        price=random.choice(
                            [
                                5000,
                                5500,
                                6000,
                                6500,
                            ]
                        ),
                    )
                except IntegrityError:
                    continue

        add_rooms()
        media_base_dir = settings.BASE_DIR / "media/"

        def add_room_images():
            rooms = Room.objects.all()
            for i in range(options["rooms"] or len(rooms)):
                for j in range(random.randint(3, 5)):
                    try:
                        local_img_path = (
                            f"demo/rooms/room-{random.randint(1, 10)}-1.webp"
                        )
                        instance = RoomImage.objects.create(
                            room=rooms[i],
                            image_full=os.path.join(
                                media_base_dir, local_img_path
                            ),
                            order=j,
                        )
                        cloud_filename = local_img_path

                        # with open(
                        #     os.path.join(media_base_dir, local_img_path),
                        #     "rb",
                        # ) as f:
                        #     print(
                        #         "open",
                        #         os.path.join(media_base_dir, local_img_path),
                        #     )
                        #     instance.image_full.save(
                        #         cloud_filename, File(f), save=True
                        #     )
                    except IntegrityError:
                        continue

        add_room_images()

        self.stdout.write(
            self.style.SUCCESS("✅ Database seeded with fake data")
        )
