from django.core.management.base import BaseCommand
from site_content.models import Place, PlaceImage
from django.db.utils import IntegrityError
from faker import Faker

import os
from django.core.files import File
from django.conf import settings

fake = Faker()


class Command(BaseCommand):
    help = "Populate database with Place instances for tests"

    def add_arguments(self, parser):
        parser.add_argument("--num", type=int, default=4, help="Number of places")

    def handle(self, *args, **options):

        if Place.objects.exists():
            # places = Place.objects.all()
            # places.delete()
            self.stdout.write(
                self.style.SUCCESS(
                    "Skipping generating data for Place. Place already exist."
                )
            )
            return
        places_data = [
            {
                "name": "Tanaat",
                "slug": "tanaat",
                "description": fake.text(),
                "distance": 7.4,
            },
            {
                "name": "Noravank monastery",
                "slug": "noravank",
                "description": fake.text(),
                "distance": 24.6,
            },
            {
                "name": "Spitakavor",
                "slug": "spitakavor",
                "description": fake.text(),
                "distance": 8.0,
            },
            {
                "name": "Dadal bridge",
                "slug": "dadal",
                "description": fake.text(),
                "distance": 7.4,
            },
            {
                "name": "Yeghegnadzor museum",
                "slug": "yegheg museum",
                "description": fake.text(),
                "distance": 3.0,
            },
            {
                "name": "Areni",
                "slug": "areni",
                "description": fake.text(),
                "distance": 19.0,
            },
            {
                "name": "Tsahats Kar",
                "slug": "tsahats",
                "description": fake.text(),
                "distance": 28,
            },
            {
                "name": "Jermuk",
                "slug": "jermuk",
                "description": fake.text(),
                "distance": 50,
            },
            {
                "name": "Sisian",
                "slug": "sisian",
                "description": fake.text(),
                "distance": 89,
            },
            {
                "name": "Tatev",
                "slug": "tatev",
                "description": fake.text(),
                "distance": 134,
            },
            {
                "name": "Goris",
                "slug": "goris",
                "description": fake.text(),
                "distance": 119,
            },
            {
                "name": "Yerevan",
                "slug": "yerevan",
                "description": fake.text(),
                "distance": 128,
            },
            {
                "name": "Sevan",
                "slug": "sevan",
                "description": fake.text(),
                "distance": 131,
            },
            {
                "name": "Church of the Holy Cross",
                "slug": "surb_khach",
                "description": fake.text(),
                "distance": 10,
            },
            {
                "name": "Gladzor museum",
                "slug": "gladzor_museum",
                "description": fake.text(),
                "distance": 2.4,
            },
            {
                "name": "Vayotz Sar vulcano",
                "slug": "vayotz_sar",
                "description": fake.text(),
                "distance": 25,
            },
            {
                "name": "Ulgyur",
                "slug": "ulgyur",
                "description": fake.text(),
                "distance": 22,
            },
            {
                "name": "Yeghegis",
                "slug": "yeghegis",
                "description": fake.text(),
                "distance": 24,
            },
        ]

        media_base_dir = settings.BASE_DIR / "media/"
        order = 0
        for p in places_data:
            place_instance = Place.objects.create(
                name=p["name"],
                slug=p["slug"],
                description=p["description"],
                distance=p["distance"],
            )
            local_img_path = f"demo/places/{p["slug"]}.jpg"

            if not settings.ON_RENDER and not os.path.exists(
                os.path.join(local_img_path)
            ):
                order += 1
                continue
            img_instance = PlaceImage.objects.create(
                alt_text=p["slug"],
                order=order,
                place=place_instance,
                image_full=os.path.join(local_img_path),
            )
            if settings.ON_RENDER:
                with open(os.path.join(media_base_dir, local_img_path), "rb") as f:
                    img_instance.image_full.save(
                        os.path.join(local_img_path),
                        File(f),
                        save=True,
                    )
            order += 1

        self.stdout.write(self.style.SUCCESS("✅ database seeded with fake Place data"))
