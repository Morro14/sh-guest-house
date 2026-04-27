from django.urls import path
from site_content.views import (
    TranslationView,
    RoomSetView,
    PlaceSetView,
    WideImageSet,
    PageContentView,
    GridImageSet,
    review_details,
    review_list,
)

urlpatterns = [
    path("translation", TranslationView.as_view()),
    path("rooms/", RoomSetView.as_view()),
    path("places", PlaceSetView.as_view()),
    path("page-content", PageContentView.as_view()),
    path("wide-images/<slug:tag>", WideImageSet.as_view()),
    path("grid-images", GridImageSet.as_view()),
    path("reviews", review_list),
    path("reviews/<int:pk>", review_details),
]
