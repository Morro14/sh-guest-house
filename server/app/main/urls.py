from django.urls import path
from .views import (
    TranslationView,
    BookingView,
    RoomSetView,
    PlaceSetView,
    WideImageSet,
)

urlpatterns = [
    path("translation", TranslationView.as_view()),
    path("booking", BookingView.as_view()),
    path("rooms", RoomSetView.as_view()),
    path("places", PlaceSetView.as_view()),
    path("wide-images", WideImageSet.as_view()),
]
