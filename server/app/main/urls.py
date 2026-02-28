from django.urls import path
from .views import (
    BookingRoomsRequestView,
    BookingRequestSummaryView,
    BookingRequestValidateView,
    reservation_price_view,
    template_test,
)

urlpatterns = [
    path("request", BookingRoomsRequestView.as_view()),
    path("request-summary", BookingRequestSummaryView.as_view()),
    path("validate", BookingRequestValidateView.as_view()),
    path("reservation-price", reservation_price_view),
    path("template-test", template_test),
]
