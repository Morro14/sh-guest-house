from site_content.models import Image
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Generate image thumbnails"

    def handle(self, *args, **options):
        for image in Image.objects.all():
            image.variants

        self.stdout.write(
            self.style.SUCCESS("✅ Thumbnail images generated")
        )
