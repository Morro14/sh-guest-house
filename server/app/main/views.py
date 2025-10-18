from rest_framework.response import Response
from dotenv import load_dotenv
from django.contrib.auth import get_user_model


load_dotenv()

USER_MODEL = get_user_model()


