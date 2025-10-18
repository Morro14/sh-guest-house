from django.urls import path, include
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    GoogleLoginView,
    TempTokenConvert,
)


urlpatterns = [
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("register", RegisterView.as_view()),
    path("password-reset/", include("django_rest_passwordreset.urls")),
    path("profile", ProfileView.as_view()),
    path("google/callback", GoogleLoginView.as_view()),
    path("temp-token-convert", TempTokenConvert.as_view()),
]
