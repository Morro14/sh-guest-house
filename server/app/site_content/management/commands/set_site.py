from django.core.management.base import BaseCommand
from django.contrib.sites.models import Site
from django.conf import settings


class Command(BaseCommand):
    help = "Set django site's domain name and site name"

    def handle(self, *args, **options):
        site = Site.objects.all().first()
        site.domain = settings.SITE_DOMAIN
        site.name = settings.SITE_NAME
        site.save()

        self.stdout.write(
            self.style.SUCCESS("✅ Site name and domain are set")
        )
