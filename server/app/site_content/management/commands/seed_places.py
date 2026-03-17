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
        parser.add_argument(
            "--num", type=int, default=4, help="Number of places"
        )

    def handle(self, *args, **options):

        if Place.objects.exists():
            places = Place.objects.all()
            places.delete()
            # self.stdout.write(
            #     self.style.SUCCESS(
            #         "Skipping generating data for Place. Place already exist."
            #     )
            # )
            # return
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
            img_instance = PlaceImage.objects.create(
                alt_text=p["slug"],
                order=order,
                place=place_instance,
                image_full=os.path.join(media_base_dir, local_img_path),
            )
            with open(
                os.path.join(media_base_dir, local_img_path), "rb"
            ) as f:
                img_instance.image_full.save(
                    os.path.join(local_img_path),
                    File(f),
                    save=True,
                )
            order += 1

        self.stdout.write(
            self.style.SUCCESS("✅ database seeded with fake Place data")
        )
