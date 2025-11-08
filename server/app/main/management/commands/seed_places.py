from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from main.models import Place, PlaceImage
from django.db.utils import IntegrityError
from faker import Faker


USER = get_user_model()
fake = Faker()


class Command(BaseCommand):
    help = "Populate database with Place instances for tests"

    def add_arguments(self, parser):
        parser.add_argument("--num", type=int, default=4,
                            help="Number of places")

    def handle(self, *args, **options):
        places_data = [{'name': 'Tanaat', 'slug': 'tanaat', 'description': fake.text(), 'distance': 7.4},
                       {'name': 'Noravank monastery', 'slug': 'noravank',
                        'description': fake.text(), 'distance': 24.6},
                       {'name': 'Spitakavor', 'slug': 'spitakavor',
                        'description': fake.text(), 'distance': 8.0},
                       {'name': 'Dadal bridge', 'slug': 'dadal',
                        'description': fake.text(), 'distance': 7.4}
                       ]
        for p in places_data:
            try:
                Place.objects.create(
                    name=p['name'], slug=p['slug'], description=p['description'], distance=p['distance'])
            except IntegrityError:
                continue
        tanaat_img = PlaceImage.objects.create(
            alt_text='tanaat', order=0, place=Place.objects.get(slug="tanaat"), image_full="static/img/full/tanaat.jpg")
        noravank_img = PlaceImage.objects.create(
            alt_text='noravank', order=0, place=Place.objects.get(slug="noravank"), image_full="static/img/full/noravank.jpg")
        spitakavor_img = PlaceImage.objects.create(
            alt_text='spitakavor', order=0, place=Place.objects.get(slug="spitakavor"), image_full="static/img/full/spitakavor.jpg")
        dadal_img = PlaceImage.objects.create(
            alt_text='dadal', order=0, place=Place.objects.get(slug="dadal"), image_full="static/img/full/dadal.jpg")
        self.stdout.write(self.style.SUCCESS(
            "✅ database seeded with fake data"))
