from django.urls import path
from .views import (
    TranslationView,
    BookingRoomsRequestView,
    RoomSetView,
    PlaceSetView,
    WideImageSet,
    BookingRequestSummaryView,
    BookingRequestValidateView,
)

urlpatterns = [
    path("translation", TranslationView.as_view()),
    path("booking/request", BookingRoomsRequestView.as_view()),
    path("booking/request-summary", BookingRequestSummaryView.as_view()),
    path("booking/confirm", BookingRequestValidateView.as_view()),
    path("rooms", RoomSetView.as_view()),
    path("places", PlaceSetView.as_view()),
    path("wide-images", WideImageSet.as_view()),
]
