import jwt
import os
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()


class SessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
        print(
            "REQUEST data",
            request.data,
        )
        print("REQUEST META", request.META.get("HTTP_X_BOOKING_TOKEN"))
        try:
            token = request.META.get("HTTP_X_BOOKING_TOKEN")

        except KeyError:
            print("0")
            raise AuthenticationFailed("Session token is missing or expired")
        if not token:
            print("1")
            raise AuthenticationFailed("Session token is missing or expired")
        try:
            payload = jwt.decode(token, os.environ.get("JWT_SECRET"), "HS256")
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Session token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        if payload["jti"]:
            pass
        return (None, payload)
