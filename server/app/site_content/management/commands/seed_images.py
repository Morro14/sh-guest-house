from django.core.management.base import BaseCommand
from site_content.models import WideImage, ImageTag
from django.db.utils import IntegrityError

import os
from django.core.files import File
from django.conf import settings

tags = ["main", "place"]
images_data = [
    {"name": "wide-main-1", "tag": "main", "order": 0},
    {"name": "wide-main-2", "tag": "main", "order": 1},
    {"name": "wide-main-3", "tag": "main", "order": 2},
    {"name": "wide-place-1", "tag": "place", "order": 0},
    {"name": "wide-place-2", "tag": "place", "order": 1},
    {"name": "wide-place-3", "tag": "place", "order": 3},
]


class Command(BaseCommand):
    help = "Populate database with WideImage instances for tests"

    def handle(self, *args, **options):

        if WideImage.objects.exists():
            self.stdout.write(
                self.style.SUCCESS(
                    "Skipping generating data for WideImage. WideImage already exist."
                )
            )
            return

        def add_tags():
            img_tags = [ImageTag(name=tag) for tag in tags]
            img_tags_obj = ImageTag.objects.bulk_create(img_tags)
            return img_tags_obj

        image_tags = add_tags()

        media_base_dir = settings.BASE_DIR / "media/"

        def add_images():
            for i in images_data:
                try:
                    local_img_path = f"demo/wide/{i["name"]}.jpg"
                    cloud_file_path = local_img_path
                    tag = next(
                        (tag for tag in image_tags if tag.name == i["tag"]),
                        None,
                    )
                    img = WideImage.objects.create(
                        alt_text=i["name"],
                        image_full=os.path.join(local_img_path),
                    )
                    img.tag.add(tag)

                    with open(
                        os.path.join(media_base_dir, local_img_path),
                        "rb",
                    ) as f:
                        img.image_full.save(
                            cloud_file_path, File(f), save=True
                        )
                except IntegrityError:
                    continue

        add_images()

        self.stdout.write(
            self.style.SUCCESS("✅ Database seeded with wide images")
        )
