from django.contrib import admin


class StaffLimitedAdminSite(admin.AdminSite):
    def get_app_list(self, request, app_label=None):
        """
        Customizes the dashboard list.
        """
        app_dict = self._build_app_dict(request, app_label)

        if (
            request.user.is_active
            and request.user.is_staff
            and not request.user.is_superuser
        ):
            allowed_apps = ["site_content", "main", "demo"]
            return sorted(
                [app for app in app_dict.values() if app["app_label"] in allowed_apps],
                key=lambda x: x["name"].lower(),
            )


staff_admin_site = StaffLimitedAdminSite(name="staff_admin")
