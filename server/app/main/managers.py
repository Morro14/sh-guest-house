from django.db import models
from .models import Reservation


class ConfirmedReservationManager(models.Manager):
    def get_queryset(self):
        return (
            super().get_queryset().filter(status=Reservation.Status.CONFIRMED)
        )
