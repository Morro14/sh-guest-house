from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType


from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Add group permissions"

    def handle(self, *args, **options):
        staff_group, created = Group.objects.get_or_create(
            name="Staff Managers"
        )

        target_apps = ["site_content", "main"]

        perms = Permission.objects.filter(
            content_type__app_label__in=target_apps
        )

        staff_group.permissions.set(perms)

        print(
            f"Success: Assigned {perms.count()} permissions to '{staff_group.name}'."
        )
