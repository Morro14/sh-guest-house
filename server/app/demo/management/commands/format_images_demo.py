from django.core.management import BaseCommand
from demo.models import GridImageDemo, RoomImageDemo, PlaceImageDemo, WideImageDemo
from PIL import Image as ImagePIL, ImageOps
from io import BytesIO
import os
from django.core.files.base import ContentFile


class Command(BaseCommand):
    help = "Format images"

    def handle(self, *args, **kwargs):
        grid_images = GridImageDemo.objects.all()
        room_images = RoomImageDemo.objects.all()
        place_images = PlaceImageDemo.objects.all()
        wide_images = WideImageDemo.objects.all()
        all_queries = [grid_images, room_images, place_images, wide_images]
        for query in all_queries:
            for obj in query:
                with obj.image_full.open("rb"):
                    img = ImagePIL.open(obj.image_full.file)
                    img = ImageOps.exif_transpose(img)

                    buffer = BytesIO()
                    img.save(buffer, "WEBP")
                    buffer.seek(0)

                    base, _ = os.path.splitext(obj.image_full.name)
                    filename = f"{base}.webp"
                    obj.image_full.save(
                        filename,
                        ContentFile(buffer.read()),
                        save=False,
                    )

                obj.save(update_fields=["image_full"])
        # obj = Test.objects.create()
        # obj.image.save(
        #     "demo/grid_images/house-guests-1.webp",
        #     ContentFile(b"demo/grid_images/house-guests-1.webp"),
        #     save=False,
        # )
