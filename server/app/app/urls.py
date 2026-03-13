"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from two_factor.urls import urlpatterns as tf_urls
from two_factor.admin import AdminSiteOTPRequired
from main.views import FrontendLogsView
from site_content.views import FrontendView

admin.site.__class__ = AdminSiteOTPRequired
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/booking/", include("main.urls")),
    path("api/content/", include("site_content.urls")),
    path("api/logs-frontend", FrontendLogsView.as_view()),
    path("api-auth/", include("auth_app.urls")),
    path("", include(tf_urls)),
    path("", FrontendView.as_view()),
    # re_path(r"^(?:.*)/?$", FrontendView.as_view()),
]
urlpatterns += static(
    settings.STATIC_URL, document_root=settings.STATIC_ROOT
)
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(
#     settings.THUMBNAIL_MEDIA_URL,
#     document_root=settings.THUMBNAIL_MEDIA_ROOT,
# )
