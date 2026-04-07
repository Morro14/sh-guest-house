from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_rating_value(value: float):
    if value < 0 or value > 10:
        raise ValidationError(_(f"{value} must be between 0 and 10"))
