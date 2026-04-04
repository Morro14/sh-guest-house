from django.core.management.base import BaseCommand
from site_content.models import GridImage, ImageTag
from django.db.utils import IntegrityError

import os
from django.core.files import File
from django.conf import settings

images_data = [
    {"name": "img-grid-1", "tag": "main", "order": 1, "grid_format": "wide"},
    {"name": "img-grid-2", "tag": "main", "order": 2, "grid_format": "medium"},
    {"name": "img-grid-3", "tag": "main", "order": 3, "grid_format": "portrait"},
    {"name": "img-grid-4", "tag": "main", "order": 4, "grid_format": "small"},
    {"name": "img-grid-5", "tag": "main", "order": 5, "grid_format": "small"},
]


class Command(BaseCommand):
    help = "Populate database with GridImage instances for tests"

    def handle(self, *args, **options):

        if GridImage.objects.exists():
            self.stdout.write(
                self.style.SUCCESS(
                    "Skipping generating data for GridImage. GridImage already exist."
                )
            )
            return

        tag, created = ImageTag.objects.get_or_create(name="house")

        media_base_dir = settings.BASE_DIR / "media/"

        def add_images():
            for i in images_data:
                try:
                    local_img_path = f"demo/grid/{i["name"]}.jpg"
                    cloud_file_path = local_img_path
                    img = GridImage.objects.create(
                        order=i["order"],
                        alt_text=i["name"],
                        image_full=os.path.join(local_img_path),
                        format_in_grid=i["grid_format"],
                    )
                    img.tag.add(tag or created)
                    if settings.ON_RENDER:
                        with open(
                            os.path.join(media_base_dir, local_img_path),
                            "rb",
                        ) as f:
                            img.image_full.save(cloud_file_path, File(f), save=True)
                except IntegrityError:
                    continue

        add_images()

        self.stdout.write(self.style.SUCCESS("✅ Database seeded with grid images"))
