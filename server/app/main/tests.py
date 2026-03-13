from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from django.core.management import call_command
from .models import Reservation
from datetime import date

from django.test.client import RequestFactory

from django.contrib import admin


class EmailTest(APITestCase):
    def test_res_request(self):
        res = Reservation.objects.create(
            check_in=date(2026, 3, 21),
            check_out=date(2026, 3, 23),
            email="ivfmn2@gmail.com",
            message="123",
            guest_name="test testman",
        )
        res.validate_no_overlap()


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
        app_list = admin.site.get_app_list(request)
        print(app_list)
        # print("all perms", user.get_all_permissions())
        # print("admin registery", admin.site._registry)
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
