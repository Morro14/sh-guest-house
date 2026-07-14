from django.urls import path

from .views import (
    BookingRoomsRequestView,
    BookingRequestSummaryView,
    BookingRequestValidateView,
    reservation_price_view,
    TranslationView,
    RoomSetView,
    PlaceSetView,
    WideImageSet,
    PageContentView,
    ImageGridSet,
    review_details,
    review_list,
)
from main.views import FrontendLogsView

urlpatterns = [
    path("booking/request", BookingRoomsRequestView.as_view()),
    path("booking/request-summary", BookingRequestSummaryView.as_view()),
    path("booking/validate", BookingRequestValidateView.as_view()),
    path("booking/reservation-price", reservation_price_view),
    path("content/translation", TranslationView.as_view()),
    path("content/rooms/", RoomSetView.as_view()),
    path("content/places", PlaceSetView.as_view()),
    path("content/page-content", PageContentView.as_view()),
    path("content/wide-images/<slug:tag>", WideImageSet.as_view()),
    path("content/image-grids", ImageGridSet.as_view()),
    path("content/reviews", review_list),
    path("content/reviews/<int:pk>", review_details),
    path("logs-frontend", FrontendLogsView.as_view()),
    # path("template-test", template_test),
]
