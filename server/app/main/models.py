from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import structlog

User = get_user_model()
log = structlog.get_logger()


class ReservationBase(models.Model):
    class Meta:
        default_manager_name = "objects"
        base_manager_name = "objects"
        abstract = True
        verbose_name = _("reservation")

    class Status(models.TextChoices):
        REQUESTED = "requested"
        VALIDATED = "validated"
        CONFIRMED = "confirmed"
        DECLINED = "declined"

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.REQUESTED
    )

    class ReservationQuerySet(models.QuerySet):
        def requested(self):
            return self.filter(status=Reservation.Status.REQUESTED)

        def validated(self):
            return self.filter(status=Reservation.Status.VALIDATED)

        def confirmed(self):
            return self.filter(status=Reservation.Status.CONFIRMED)

        def declined(self):
            return self.filter(status=Reservation.Status.DECLINED)

    class ConfirmedReservationManager(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(status=Reservation.Status.CONFIRMED)

    class ValidatedReservationManager(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(status=Reservation.Status.VALIDATED)

    created_at = models.DateTimeField(
        verbose_name=_("created at"),
        auto_created=True,
        auto_now=True,
        editable=False,
    )
    user = models.ForeignKey(
        to=User,
        blank=True,
        default=None,
        null=True,
        on_delete=models.CASCADE,
    )
    guest_name = models.CharField(verbose_name=_("Guest name"))
    email = models.EmailField(unique=False, default=None)
    check_in = models.DateField()
    check_out = models.DateField()

    confirmed = ConfirmedReservationManager()
    validated = ValidatedReservationManager()
    nights = models.PositiveIntegerField()
    message = models.TextField(max_length=255, default="")

    objects = ReservationQuerySet.as_manager()

    def get_stay_nights(self):
        delta = self.check_out - self.check_in
        return delta.days

    def get_guests(self):
        rooms = self.rooms_reserved.all()
        guests = {"adults": 0, "children": 0}

        for room in rooms:
            guests["adults"] += room.adults
            guests["children"] += room.children

        return guests

    def clean(self):
        # date validation
        if self.check_in >= self.check_out:
            raise ValidationError("Check-out date must be after check-in date.")

    def validate_no_overlap(self):
        print("self.rooms_reserved", self.rooms_reserved.all())
        rooms_reserved = self.rooms_reserved.prefetch_related(
            "room", "reservation"
        ).all()
        for room_res in rooms_reserved:
            overlap = RoomReserved.objects.filter(
                room=room_res.room,
                reservation__check_in__lt=self.check_out,
                reservation__check_out__gt=self.check_in,
            ).exists()
            # overlap = (
            #     Reservation.confirmed.filter(
            #         rooms_reserved=room_res,
            #         check_in__lt=self.check_out,
            #         check_out__gt=self.check_in,
            #     )
            #     .exclude(pk=self.pk)
            #     .exists()
            # )
            if overlap:
                log.warning(f"room '{room_res.room.slug}' is already booked")
                # raise ValidationError(f"Room '{room_res.room.name}' is already booked.")
                return False
            self.status = self.Status.VALIDATED
            self.save()
            return self

    def confirm(self):
        if self.status != self.Status.VALIDATED:
            raise Exception("Reservation is not validated yet")
        self.status = self.Status.CONFIRMED
        self.save()

        def decline(self):

            if self.status == self.Status.CONFIRMED:
                raise Exception("Reservation is already confirmed")
            if self.status != self.Status.VALIDATED:
                raise Exception("Reservation is not validated yet")
            self.status = self.Status.DECLINED
            self.save()

    def save(self, *args, **kwargs):
        self.clean()
        self.nights = self.get_stay_nights()
        super().save(*args, **kwargs)


class Reservation(ReservationBase):
    pass


class RoomBase(models.Model):
    """Represents a room with information about it"""

    def __str__(self):
        return self.name

    slug = models.SlugField(
        unique=True,
        verbose_name=_("slug"),
        help_text=_("unique name (lower case without spaces)"),
    )
    name = models.CharField(max_length=80, verbose_name=_("Room name"))
    adults_num = models.IntegerField(
        verbose_name=_("Adults"),
        help_text=_("places in the room for any guests (adult or children)"),
    )
    children_num = models.IntegerField(
        verbose_name=_("Children"),
        help_text=_("places in the room only for children"),
    )
    beds = models.TextField(max_length=255, default="")
    price = models.IntegerField(default=5000)
    description = models.TextField(max_length=255, default="")

    class Meta:
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")
        abstract = True


class Room(RoomBase):
    pass


class RoomReserved(models.Model):
    """Respresents an instance of the room that is used in the reservation (requested or confirmed)"""

    class Meta:
        verbose_name = _("Reserved room")
        verbose_name_plural = _("Reserved rooms")

    def __str__(self):
        return self.room.name

    adults = models.IntegerField(verbose_name=_("adult places reserved"), default=0)
    children = models.IntegerField(
        verbose_name=_("children places reserved"), default=0
    )
    room = models.ForeignKey(
        to=Room,
        on_delete=models.CASCADE,
        related_name="rooms_reserved",
        related_query_name="room_reserved",
    )
    reservation = models.ForeignKey(
        to=Reservation,
        on_delete=models.CASCADE,
        related_name="rooms_reserved",
        related_query_name="room_reserved",
    )
