from rest_framework.response import Response
from rest_framework.views import APIView
from dotenv import load_dotenv
from django.contrib.auth import get_user_model
from django.utils import translation
from django.conf import settings
import os
import json
from django.utils.translation import gettext as _
load_dotenv()

User = get_user_model()

class TranslationView(APIView):
	permission_classes = []
	authentication_classes = []
	def get(self, request):
		keys_path = os.path.join(settings.BASE_DIR, "main/translations.json")
		keys = json.load(open(keys_path))

		lang = request.GET.get('lang', 'en')
		translation.activate(lang)

		translations = {key: _(key) for key in keys}
		return Response(translations)