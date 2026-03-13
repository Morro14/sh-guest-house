from django.contrib.auth.models import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email_ = self.normalize_email(email)
        user = self.model(email=email_, **extra_fields)
        user.set_password(password)
        user.full_clean()
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        user = self.create_user(
            email, password=password, is_superuser=True, **extra_fields
        )

        user.is_staff = True
        user.save()
        return user
