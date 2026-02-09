from django.urls import path
from .views import (
    TranslationView,
    BookingRoomsRequestView,
    RoomSetView,
    PlaceSetView,
    WideImageSet,
    BookingRequestSummaryView,
    BookingRequestValidateView,
    reservation_price_view,
    template_test,
)

urlpatterns = [
    path("translation", TranslationView.as_view()),
    path("booking/request", BookingRoomsRequestView.as_view()),
    path("booking/request-summary", BookingRequestSummaryView.as_view()),
    path("booking/validate", BookingRequestValidateView.as_view()),
    path("rooms", RoomSetView.as_view()),
    path("places", PlaceSetView.as_view()),
    path("wide-images/<slug:tag>", WideImageSet.as_view()),
    path("booking/reservation-price", reservation_price_view),
]
