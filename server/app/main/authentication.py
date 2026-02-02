import jwt
import os
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            return None
        try:
            payload = jwt.decode(
                token, os.environ.get("JWT_SECRET"), "HS256"
            )
            # print("payload", payload)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
        try:
            user = User.objects.get(id=payload["id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("Unauthenticated")
        return (user, None)


class SessionAuthentication(BaseAuthentication):
    def authenticate(self, request):
        try:
            token = request.COOKIES.get("booking_request_token")
        except KeyError:
            raise AuthenticationFailed("Session cookie missing or expired")
        if not token:
            raise AuthenticationFailed("Session cookie missing or expired")
        try:
            payload = jwt.decode(
                token, os.environ.get("JWT_SECRET"), "HS256"
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Session token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")
        return (None, payload)
