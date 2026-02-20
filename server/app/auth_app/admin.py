from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from .forms import (
    UserCreationForm as CustomUserCreationForm,
    UserChangeForm as CustomUserChangeForm,
)
from django.utils.translation import gettext as _


class CustomUserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ["email", "is_staff", "is_superuser"]
    list_filter = ["is_staff", "is_superuser"]
    fieldsets = [
        (
            None,
            {
                "fields": [
                    "email",
                    "password",
                ]
            },
        ),
        (_("Permissions"), {"fields": ["is_staff", "is_superuser"]}),
    ]
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []


admin.site.register(User, CustomUserAdmin)
