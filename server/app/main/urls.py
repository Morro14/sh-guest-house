from django.urls import path
from .views import TranslationView, BookingView, RoomSetView

urlpatterns = [
	path('translation', TranslationView.as_view()),
	path('booking', BookingView.as_view()),
	path('rooms', RoomSetView.as_view()),

]
