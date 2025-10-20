from django.urls import path
from .views import TranslationView

urlpatterns = [
	path('translation', TranslationView.as_view())

]
