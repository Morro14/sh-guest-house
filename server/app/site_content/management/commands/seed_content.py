from django.core.management.base import BaseCommand
from site_content.models import ContentPage
from faker import Faker

fake = Faker()

content_data = [
    {
        "tag": "about",
        "title": "About the house",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at scelerisque ante. Morbi efficitur porta lacus eget commodo. Suspendisse facilisis et neque eget feugiat. Vestibulum et tincidunt ex, nec posuere justo. Phasellus mollis libero sed arcu malesuada, vel lobortis lorem aliquam. Phasellus ut nisl ut dui aliquam hendrerit eu pretium massa. Nunc a malesuada tortor. Vestibulum sit amet lectus nibh. Praesent sit amet lorem ac mi maximus vulputate. Sed ac pharetra lorem. Fusce convallis leo lacus, in vulputate nibh aliquam porttitor.",
    },
    {
        "tag": "rooms-preview",
        "title": "Rooms",
        "body": "Maecenas dui purus, tempus et tristique a, imperdiet eu quam. Mauris vitae elit sem. Integer tincidunt, nunc sit amet sodales molestie, elit metus laoreet augue, sit amet tristique risus risus nec magna.",
    },
    {
        "tag": "places",
        "title": "Points of interest in the province",
        "body": "Cras tortor tellus, volutpat et odio ac, congue dignissim felis. In tempor odio vel ligula vehicula, a elementum orci dictum. Sed leo nulla, volutpat nec dapibus a, vulputate eu eros. Suspendisse semper ipsum id ipsum euismod porttitor. Curabitur mollis vel arcu vitae porta.",
    },
    {
        "tag": "services",
        "title": "Services",
        "body": "Cras tortor tellus, volutpat et odio ac, congue dignissim felis. In tempor odio vel ligula vehicula, a elementum orci dictum. Sed leo nulla, volutpat nec dapibus a, vulputate eu eros. Suspendisse semper ipsum id ipsum euismod porttitor. Curabitur mollis vel arcu vitae porta.",
    },
    {
        "tag": "location",
        "title": "How to get to us",
        "body": "Cras tincidunt nisl id velit bibendum tincidunt. Vivamus semper ex nibh, sit amet blandit est posuere vel. Morbi condimentum malesuada ex sed convallis. Maecenas felis urna, faucibus nec nulla pellentesque, tristique blandit ex. Mauris quis tempus velit. Etiam ut est ligula. Fusce sagittis sodales enim vel consectetur.",
    },
]


class Command(BaseCommand):
    help = "Populate database with Contentinstances for tests"

    def handle(self, *args, **options):
        if ContentPage.objects.exists():
            self.stdout.write(
                self.style.SUCCESS(
                    "Skipping generating data for ContentPage. ContentPage already exists."
                )
            )
            return
        for c in content_data:
            ContentPage.objects.create(
                tag=c["tag"],
                title_en=c["title"],
                body_en=c["body"],
            )

        self.stdout.write(
            self.style.SUCCESS("✅ database seeded with fake ContentPage data")
        )
