from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from django.core.management import call_command

from django.test.client import RequestFactory

from django.contrib import admin


class AdminTest(APITestCase):
    def setUp(self):
        User = get_user_model()
        User.objects.create_superuser("test@email.com", "testsu941")

    def test_admin(self):

        rf = RequestFactory()
        User = get_user_model()
        user = User.objects.filter(is_superuser=True).first()
        print(user)
        request = rf.get("/admin/")
        request.user = user
        print("all perms", user.get_all_permissions())
        # for model, model_admin in admin.site._registry.items():
        #     module_perm = model_admin.has_module_permission(request)
        #     perms = model_admin.get_model_perms(request)
        #
        #     print(
        #         model._meta.app_label,
        #         model.__name__,
        #         "module:",
        #         module_perm,
        #         "perms:",
        #         perms,
        #     )
