import os
from django.core.files import File
from django.core.management.base import BaseCommand
from main.models import Room
from site_content.models import Place, PlaceImage, RoomImage, WideImage
from django.conf import settings
from django.db.utils import IntegrityError
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        base_seed_dir = settings.BASE_DIR / "media/demo/"

        for root, dirs, files in os.walk(base_seed_dir):
            file_index = 0
            for filename in files:
                local_path = os.path.join(root, filename)

                relative_path = os.path.relpath(local_path, base_seed_dir)

                cloud_filename = os.path.join("demo", relative_path)

                if root == "room_images":
                    # gen rooms
                    rand_room_id = random.randint(0, 6)
                    room_image_instance = RoomImage(
                        alt_text=f"room-{rand_room_id}-img-{file_index}",
                        room=Room.objects.get(rand_room_id),
                    )
                    with open(local_path, "rb") as f:
                        room_image_instance.image_full.save(
                            cloud_filename, File(f), save=True
                        )
                        file_index += 1

                elif root == "wide_images":
                    pass
                elif root == "grid_images":
                    # gen wide images
                    pass
                with open(local_path, "rb") as f:
                    place_instance = Place.objects.get(name=filename.split(".")[0])
                    place_instance.image.save(cloud_filename, File(f), save=True)

        self.stdout.write(self.style.SUCCESS("Folder structure preserved in GCS!"))
