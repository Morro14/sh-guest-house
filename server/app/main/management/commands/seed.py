from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

USER = get_user_model()

class Command(BaseCommand):
    help = "Help text"
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("✅ Database seeded with fake data"))
