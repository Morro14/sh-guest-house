from django.db import models
from django.utils.translation import gettext_lazy as _

from easy_thumbnails.files import get_thumbnailer
from image_cropping import ImageRatioField
from .utils.images_util import size_to_str


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
        help_text=_("unique name (lower case without spaces)"),
    )
    title = models.CharField(
        max_length=255, verbose_name=_("Content page title"), blank=True
    )
    body = models.TextField(
        help_text=_("Write the content in Markdown fromat."),
        verbose_name=_("Content page body"),
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Content page")
        verbose_name_plural = _("Content pages")

    def __str__(self):
        return self.title


class Image(models.Model):
    blur_res = (20, 13)
    small_res = (600, 400)
    main_res = (1280, 853)

    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveBigIntegerField(default=0)
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
            "small": self.get_variant_url(
                self.small_res, self.cropping_small
            ),
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

    tag = models.ManyToManyField(to="ImageTag", blank=True)

    class Meta:
        verbose_name = _("wide photo")
        verbose_name_plural = _("wide photos")


class ImageTag(models.Model):
    name = models.CharField(max_length=30, unique=True)

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
        to="main.Room",
        on_delete=models.CASCADE,
        related_name="image",
        related_query_name="images",
    )

    def __str__(self):
        return f"{self.room.name} #{self.order}"


class Place(models.Model):
    name = models.CharField(
        unique=True, max_length=63, verbose_name=_("name")
    )
    slug = models.CharField(
        unique=True,
        max_length=30,
        verbose_name=_("slug"),
        help_text=_("unique name (lower case without spaces)"),
    )
    distance = models.FloatField(help_text=_("distance"))
    distance_comment = models.CharField(
        max_length=255,
        default="",
        blank=True,
        verbose_name=_("distance comment"),
    )
    description = models.TextField(verbose_name=_("description"))
    geoloc = models.CharField(
        verbose_name=_("geolocation link"),
        help_text=_("link to a map provider with the location of the place"),
    )
    info_link = models.CharField(
        verbose_name=_("Information link"),
        help_text=_(
            "Link to an external resources with information about the place"
        ),
        blank=True,
    )

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
