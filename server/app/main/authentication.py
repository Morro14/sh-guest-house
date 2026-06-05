import jwt
import os
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()


class SessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
        try:
            token = request.COOKIES.get("booking_request_token")
        except KeyError:
            print("1")
            raise AuthenticationFailed("Session cookie missing or expired")
        if not token:
            print("2")
            raise AuthenticationFailed("Session cookie missing or expired")
        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.ExpiredSignatureError:
            print("3")
            raise AuthenticationFailed("Session token has expired")
        except jwt.InvalidTokenError:
            print("4")
            raise AuthenticationFailed("Invalid token")

        if payload["jti"]:
            pass
        return (None, payload)
