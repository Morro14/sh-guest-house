from django.urls import path
from .views import (
    TranslationView,
    BookingView,
    RoomSetView,
    PlaceSetView,
    WideImageSet,
    BookingConfirmView,
)

urlpatterns = [
    path("translation", TranslationView.as_view()),
    path("booking-request", BookingView.as_view()),
    path("booking-confirm", BookingConfirmView.as_view()),
    path("rooms", RoomSetView.as_view()),
    path("places", PlaceSetView.as_view()),
    path("wide-images", WideImageSet.as_view()),
]
