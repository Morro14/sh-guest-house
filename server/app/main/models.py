from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from easy_thumbnails.files import get_thumbnailer
from image_cropping import ImageRatioField
from .utils.images_util import size_to_str
# from .managers import ConfirmedReservationManager

User = get_user_model()


class Reservation(models.Model):
    class Status(models.TextChoices):
        REQUESTED = "requested"
        VALIDATED = "validated"
        CONFIRMED = "confirmed"

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

    class ConfirmedReservationManager(models.Manager):
        def get_queryset(self):
            return (
                super()
                .get_queryset()
                .filter(status=Reservation.Status.CONFIRMED)
            )

    class ValidatedReservationManager(models.Manager):
        def get_queryset(self):
            return (
                super()
                .get_queryset()
                .filter(status=Reservation.Status.VALIDATED)
            )

    user = models.ForeignKey(
        to=User, blank=True, default=None, null=True, on_delete=models.CASCADE
    )
    email = models.EmailField(unique=False, default=None)
    check_in = models.DateField()
    check_out = models.DateField()

    objects = ReservationQuerySet.as_manager()
    confirmed = ConfirmedReservationManager()
    validated = ValidatedReservationManager()

    def get_stay_days(self):
        delta = self.check_out - self.check_in
        print(type(delta), delta.days)
        return delta.days

    def clean(self):
        # date validation
        if self.check_in >= self.check_out:
            raise ValidationError(
                "Check-out date must be after check-in date."
            )

    def validate_no_overlap(self):
        for room in self.rooms_reserved.all():
            overlap = (
                Reservation.confirmed.filter(
                    room_reserved=room,
                    check_in__lt=self.check_out,
                    check_out__gt=self.check_in,
                )
                .exclude(pk=self.pk)
                .exists()
            )
            if overlap:
                raise ValidationError(f"Room '{room.name}' is already booked.")
            self.status = self.Status.VALIDATED
            self.save()
            return True

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Room(models.Model):
    """Represents a room with information about it"""

    slug = models.SlugField(
        unique=True, verbose_name=_("slug"), help_text=_("slug_helptext")
    )
    name = models.CharField(max_length=80, verbose_name=_("Room_name"))
    adults_num = models.IntegerField(
        verbose_name=_("Room_adults_num"),
        help_text=_("places in the room for any guests (adult or children)"),
    )
    children_num = models.IntegerField(
        verbose_name=_("Room_children_num"),
        help_text=_("places in the room only for children"),
    )
    beds = models.TextField(max_length=255, default="")
    price = models.IntegerField(default=5000)

    class Meta:
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")


class RoomReserved(models.Model):
    """Respresents an instance of the room that is used in the reservation (requested or confirmed)"""

    class Meta:
        verbose_name = _("Reserved room")
        verbose_name_plural = _("Reserved rooms")

    adults = models.IntegerField(verbose_name=_("adults reserved"), default=0)
    children = models.IntegerField(
        verbose_name=_("children_reserved"), default=0
    )
    room = models.ForeignKey(to=Room, on_delete=models.CASCADE)
    reservation = models.ForeignKey(
        to=Reservation,
        on_delete=models.CASCADE,
        related_name="rooms_reserved",
        related_query_name="room_reserved",
    )


class ContentPage(models.Model):
    slug = models.SlugField(
        choices={
            "about": "About",
            "service": "Service",
            "location": "Location",
            "places": "Places of interest",
            "rooms-preview": "Rooms",
        },
        unique=True,
        verbose_name=_("slug"),
        help_text=_("slug_helptext"),
    )
    title = models.CharField(
        max_length=255, verbose_name=_("Content_page_title"), blank=True
    )
    body = models.TextField(
        help_text=_("Write the content in Markdown fromat."),
        verbose_name=_("Content_page_body"),
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Content_page")
        verbose_name_plural = _("Content_pages")

    def __str__(self):
        return self.title


class Image(models.Model):
    blur_res = (20, 13)
    small_res = (600, 400)
    main_res = (1280, 853)

    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveBigIntegerField(default=0)
    # TDOD change image_full name to image_original
    image_full = models.ImageField(upload_to="static/img/full")
    cropping_main = ImageRatioField("image", size_to_str(main_res))
    cropping_small = ImageRatioField("image", size_to_str(small_res))
    cropping_blur = ImageRatioField("image", size_to_str(blur_res))

    def get_variant_url(self, size, box=None, quality=80, blur=False):
        options = {
            "size": size,
            "crop": True,
            "detail": True,
            "quality": quality,
        }
        if box:
            options["box"] = box
        if blur:
            options["filters"] = ["blur"]
            options["quality"] = 30
        thumb = get_thumbnailer(self.image_full).get_thumbnail(options)

        return thumb.url

    @property
    def variants(self):
        results = {
            "blur": self.get_variant_url(
                self.blur_res, self.cropping_blur, blur=True
            ),
            "small": self.get_variant_url(self.small_res, self.cropping_small),
            "main": self.get_variant_url(self.main_res, self.cropping_main),
            "original": self.image_full.url,
        }
        return results

    class Meta:
        ordering = ["order"]
        verbose_name = "image"
        verbose_name_plural = "images"

    def __str__(self):
        return self.image_full.name


class WideImage(Image):
    main_res = (2054, 736)
    small_res = (1200, 368)

    tag = models.ManyToManyField(
        to="ImageTag", blank=True)

    class Meta:
        verbose_name = _("wide photo")
        verbose_name_plural = _("wide photos")


class ImageTag(models.Model):
    name = models.CharField(max_length=30)

    class Meta:
        verbose_name = "image tag"
        verbose_name_plural = "image tags"

    def __str__(self):
        return self.name


class RoomImage(Image):
    small_res = (700, 0)
    blur_res = (20, 12)

    class Meta:
        verbose_name = _("room image")
        verbose_name_plural = _("room images")

    room = models.ForeignKey(
        to=Room,
        on_delete=models.CASCADE,
        related_name="image",
        related_query_name="images",
    )

    def __str__(self):
        return f"{self.room.name} #{self.order}"


class Place(models.Model):
    name = models.CharField(unique=True, max_length=63, verbose_name=_("name"))
    slug = models.CharField(
        unique=True,
        max_length=30,
        verbose_name=_("slug"),
        help_text=_("slug_helptext"),
    )
    distance = models.FloatField(help_text=_("distance"))
    distance_comment = models.CharField(
        max_length=255,
        default="",
        blank=True,
        verbose_name=_("distance_comment"),
    )
    description = models.TextField(verbose_name=_("description"))

    class Meta:
        verbose_name = _("place")
        verbose_name_plural = _("places")

    def __str__(self):
        return self.name


class PlaceImage(Image):
    small_res = (700, 400)
    place = models.ForeignKey(
        to=Place,
        on_delete=models.CASCADE,
        related_name="image",
        related_query_name="images",
        verbose_name=_("place"),
    )

    class Meta:
        verbose_name = _("place image")
        verbose_name_plural = _("place images")

    def __str__(self):
        return f"{self.place.name} image f{self.pk}"
