from django.core.management import BaseCommand
from site_content.models import Image, Test, GridImage, RoomImage, PlaceImage, WideImage
from PIL import Image as ImagePIL
from io import BytesIO
import os
from django.core.files.base import ContentFile


class Command(BaseCommand):
    help = "Format images"

    def handle(self, *args, **kwargs):
        grid_images = GridImage.objects.all()
        room_images = RoomImage.objects.all()
        place_images = PlaceImage.objects.all()
        wide_images = WideImage.objects.all()
        all_imgs = grid_images + room_images + place_images + wide_images
        for obj in all_imgs:
            with obj.image_full.open("rb"):
                img = ImagePIL.open(obj.image_full.file)

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
