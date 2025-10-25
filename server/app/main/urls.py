from django.urls import path
from .views import TranslationView, BookingView, RoomsView

urlpatterns = [
	path('translation', TranslationView.as_view()),
	path('booking', BookingView.as_view()),
	path('rooms', RoomsView.as_view()),

]
