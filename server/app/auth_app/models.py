from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import CustomUserManager
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import _user_has_perm, _user_has_module_perms


class User(AbstractBaseUser, PermissionsMixin):
    def __str__(self):
        return self.email

    email = models.EmailField(
        unique=True, max_length=255, verbose_name=_("Email")
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def has_perm(self, perm, obj=None):
        if self.is_active and self.is_superuser:
            return True
        return _user_has_perm(self, perm, obj)

    def has_module_perms(self, app_label):
        if self.is_active and self.is_superuser:
            return True
        if self.is_staff:
            return app_label in ["site_content", "main"]
        return _user_has_module_perms(self, app_label)
