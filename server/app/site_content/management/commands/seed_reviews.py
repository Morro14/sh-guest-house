from django.core.management.base import BaseCommand
from site_content.models import Review
from faker import Faker
from datetime import date, timedelta, datetime

date_delta = datetime.today() - datetime(2022, 1, 1)

fake = Faker()

content_data = [
    {
        "date": fake.date(end_datetime=date_delta),
        "rating": 9,
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at scelerisque ante. Morbi efficitur porta lacus eget commodo. Suspendisse facilisis et neque eget feugiat. Vestibulum et tincidunt ex, nec posuere justo. Phasellus mollis libero sed arcu malesuada, vel lobortis lorem aliquam. Phasellus ut nisl ut dui aliquam hendrerit eu pretium massa. Nunc a malesuada tortor. Vestibulum sit amet lectus nibh. Praesent sit amet lorem ac mi maximus vulputate. Sed ac pharetra lorem. Fusce convallis leo lacus, in vulputate nibh aliquam porttitor.",
    },
    {
        "date": fake.date(end_datetime=date_delta),
        "rating": 10,
        "content": "Donec mi elit, vehicula a maximus id, dictum sit amet turpis. Curabitur placerat ante volutpat faucibus bibendum. Etiam placerat nulla ac tristique convallis. Vivamus volutpat euismod consectetur. Suspendisse euismod est at mauris mollis, sit amet mollis libero rhoncus. Duis vel elit vitae neque finibus commodo. Donec consectetur nisl tortor, id cursus urna pulvinar vitae.",
    },
    {
        "date": fake.date(end_datetime=date_delta),
        "rating": 9,
        "content": "Nunc rutrum leo in nulla feugiat, vel euismod lacus interdum. Nullam ut massa suscipit, iaculis justo vitae, accumsan sapien. Integer ullamcorper lorem erat, eget consectetur erat faucibus et. Cras egestas diam nec dui fringilla sollicitudin. Morbi congue at tortor vel hendrerit. Aliquam erat volutpat. Suspendisse potenti. Vestibulum sodales vel dolor et lacinia.",
    },
    {
        "date": fake.date(end_datetime=date_delta),
        "rating": 10,
        "content": "Sed tristique rutrum arcu ut venenatis. Mauris blandit risus ac neque dictum, non rutrum ligula viverra. Aliquam hendrerit ut nisl non scelerisque. Curabitur bibendum, quam in consectetur tincidunt, odio nunc vestibulum ex, id vehicula enim magna ut dui. Aenean eget aliquam magna. Suspendisse mi purus, fringilla dictum nibh et, venenatis euismod nisi. Integer eget dui dignissim, dapibus magna vitae, pretium risus.",
    },
    {
        "date": fake.date(end_datetime=date_delta),
        "rating": 9,
        "content": "Maecenas rhoncus dui in tincidunt commodo. Quisque vulputate at dui id vehicula. Suspendisse vitae nunc tortor. Aenean commodo id mauris id molestie. Ut bibendum nisl ut purus finibus, eget viverra mauris dictum. Ut venenatis augue eros, sed dictum augue mattis fermentum. Suspendisse dictum, eros quis vestibulum gravida, justo massa dictum mauris, et euismod mauris elit eget ligula.",
    },
]


class Command(BaseCommand):
    help = "Populate database with Reivew instances for tests"

    def handle(self, *args, **options):
        if Review.objects.exists():
            self.stdout.write(
                self.style.SUCCESS(
                    "Skipping generating data for Review. Review already exists."
                )
            )
            return
        for c in content_data:
            Review.objects.create(
                date=c["date"],
                rating=c["rating"],
                content=c["content"],
            )

        self.stdout.write(
            self.style.SUCCESS("✅ database seeded with fake Review data")
        )
