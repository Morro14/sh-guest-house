from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from easy_thumbnails.files import get_thumbnailer
from image_cropping import ImageRatioField
from .utils.images_util import size_to_str


User = get_user_model()


class Reservation(models.Model):
    user = models.ForeignKey(
        to=User, blank=True, default=None, null=True, on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    rooms = models.ManyToManyField(to="Room")

    # add rooms to check for overlapping reservations before saving
    def __init__(self, *args, rooms=None, **kwargs):
        super().__init__(*args,  **kwargs)
        self._unsaved_rooms = rooms or []

    def get_stay_days(self):
        delta = self.check_out - self.check_in
        print(type(delta), delta.days)
        return delta.days

    def clean(self):
        print(getattr(self, "_unsaved_rooms", []))
        if self.check_in >= self.check_out:
            raise ValidationError(
                "Check-out date must be after check-in date.")
        for room in getattr(self, "_unsaved_rooms", []):
            overlap = Reservation.objects.filter(
                rooms=room,
                check_in__lt=self.check_out,
                check_out__gt=self.check_in,
            ).exclude(pk=self.pk).exists()
            if overlap:
                raise ValidationError(f"Room '{room.name}' is already booked.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
        if hasattr(self, "_unsaved_rooms"):
            self.rooms.set(self._unsaved_rooms)
            del self._unsaved_rooms


class Room(models.Model):
    slug = models.SlugField(unique=True, verbose_name=_(
        'slug'), help_text=_('slug_helptext'))
    name = models.CharField(max_length=255, verbose_name=_('Room_name'))
    adults_num = models.IntegerField(verbose_name=_("Room_adults_num"))
    children_num = models.IntegerField(verbose_name=_("Room_children_num"))

    class Meta:
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")


class ContentPage(models.Model):
    slug = models.SlugField(unique=True, verbose_name=_(
        'slug'), help_text=_('slug_helptext'))
    title = models.CharField(
        max_length=255, verbose_name=_('Content_page_title'))
    body = models.TextField(help_text=_(
        "Write the content in Markdown fromat."), verbose_name=_('Content_page_body'))
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
    image_full = models.ImageField(upload_to='static/img/full')
    cropping_main = ImageRatioField(
        'image', size_to_str(main_res))  # main full image
    cropping_small = ImageRatioField(
        'image', size_to_str(small_res))  # small preview
    cropping_blur = ImageRatioField('image', size_to_str(
        blur_res))     # tiny blurred placeholder

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
            "blur": self.get_variant_url(self.blur_res, self.cropping_blur, blur=True),
            "small": self.get_variant_url(self.small_res, self.cropping_small),
            "main": self.get_variant_url(self.main_res, self.cropping_main)
        }
        return results

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.image_full.name


class RoomImage(Image):
    small_res = (700, 0)
    blur_res = (20, 12)

    room = models.ForeignKey(to=Room, on_delete=models.CASCADE,
                             related_name='image', related_query_name='images')
    beds = models.TextField(max_length=63, default='')

    def __str__(self):
        return f"{self.room.name} #{self.order}"


class Place(models.Model):
    name = models.CharField(unique=True, max_length=63,
                            verbose_name=_("name"))
    slug = models.CharField(unique=True, max_length=63, verbose_name=_(
        "slug"), help_text=_("slug_helptext"))
    distance = models.FloatField(
        help_text=_("distance"))
    distance_comment = models.TextField(
        max_length=63, default='', blank=True, verbose_name=_("distance_comment"))
    description = models.TextField(verbose_name=_("description"))

    class Meta:
        verbose_name = _("place")
        verbose_name_plural = _("places")

    def __str__(self):
        return self.name


class PlaceImage(Image):
    small_res = (700, 400)
    place = models.ForeignKey(to=Place, on_delete=models.CASCADE,
                              related_name='image', related_query_name='images', verbose_name=_("place"))

    class Meta:
        verbose_name = _("place image")
        verbose_name_plural = _("place images")

    def __str__(self):
        return f"{self.place.name} image f{self.pk}"
