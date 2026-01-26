from django.core.management.base import BaseCommand
from main.models import WideImage, ImageTag
from django.db.utils import IntegrityError

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
        def add_tags():
            img_tags = [ImageTag(name=tag) for tag in tags]
            img_tags_obj = ImageTag.objects.bulk_create(img_tags)
            return img_tags_obj

        image_tags = add_tags()
        print("test image tags", image_tags)

        def add_images():
            for i in images_data:
                try:
                    tag = next(
                        (tag for tag in image_tags if tag.name == i["tag"]),
                        None,
                    )
                    print("test first tag match", tag)
                    img = WideImage.objects.create(
                        alt_text=i["name"],
                        image_full=f"static/img/test/wide/{i["name"]}.jpg",
                    )
                    img.tag.add(tag)
                except IntegrityError:
                    continue

        add_images()

        self.stdout.write(
            self.style.SUCCESS("✅ Database seeded with wide images")
        )
