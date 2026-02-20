from django.contrib import admin


def custom_get_app_list(self, request):
    app_list = super().get_app_list(request)
    if request.user.is_superuser:
        return app_list
    excluded_adpps = [
        "django_celery_results",
        "django_rest_passwordreset",
        "django_otp",
        "auth_app",
    ]

    return [app for app in app_list if app["label"] not in excluded_adpps]


admin.site.get_app_list = custom_get_app_list
