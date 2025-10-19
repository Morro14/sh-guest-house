from django.urls import path
from .views import TranslationView

urlpatterns = [
	path('translations', TranslationView.as_view())

]
