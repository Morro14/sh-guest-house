from django.db import models
from django.utils.translation import gettext_lazy as _
from easy_thumbnails.files import get_thumbnailer
from image_cropping import ImageRatioField
from .utils.images_util import size_to_str
from .validators import validate_rating_value
import os
from django.conf import settings


class ContentPage(models.Model):
    tag = models.TextField(
        choices={
            "about": "About",
            "service": "Service",
            "location": "Location",
            "places": "Places of interest",
            "rooms-preview": "Rooms",
            "contacts": "Contacts",
            "additional": "Additional",
        },
        default="additional",
        verbose_name=_("tag"),
        help_text=_("content tag to help udentify what it is for"),
    )
    title = models.CharField(
        max_length=255, verbose_name=_("Content page title"), blank=True
    )
    body = models.TextField(
        verbose_name=_("Content page body"),
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Content page")
        verbose_name_plural = _("Content pages")

    def __str__(self):
        return self.title


def get_upload_path(instance, filename):
    cat_folder_name = instance.__class__.__name__
    cat_names = {
        "GridImage": "grid_images",
        "WideImage": "wide_images",
        "RoomImage": "room_images",
        "PlaceImage": "place_images",
    }
    rel_fields = [
        "place",
        "room",
    ]
    without_rel_fields = ["WideImage", "GridImage"]
    instance_folder_name = ""

    if cat_folder_name in without_rel_fields:
        if os.environ.get("DEBUG") == "True":
            return os.path.join("demo", cat_names[cat_folder_name], filename)
        return os.path.join(cat_names[cat_folder_name], filename)
    for field in rel_fields:
        field = getattr(instance, field, None)
        if field:
            instance_folder_name = field.slug
            if os.environ.get("DEBUG") == "True":
                return os.path.join(
                    "demo", cat_names[cat_folder_name], instance_folder_name, filename
                )
            return os.path.join(
                cat_names[cat_folder_name], instance_folder_name, filename
            )


class Image(models.Model):
    blur_res = (100, 100)
    small_res = (600, 600)
    main_res = (1280, 1280)

    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveBigIntegerField(default=0)
    image_full = models.ImageField(upload_to=get_upload_path)
    cropping_main = ImageRatioField("image", size_to_str(main_res))
    cropping_small = ImageRatioField("image", size_to_str(small_res))
    cropping_blur = ImageRatioField("image", size_to_str(blur_res))

    def get_variant_url(self, size, box=None, quality=80, blur=False):
        options = {
            "size": size,
            "crop": False,
            "detail": True,
            "quality": quality,
        }
        if box:
            options["box"] = box
        if blur:
            options["filters"] = ["blur"]
            options["quality"] = 30
        thumb = get_thumbnailer(self.image_full).get_thumbnail(options)
        media_baseurl = settings.MEDIA_BASE_URL
        if settings.ON_RENDER and media_baseurl in thumb.url:
            base, pathname = thumb.url.split(sep=media_baseurl)
            return pathname
        return thumb.url

    @property
    def variants(self):
        media_baseurl = os.environ.get("MEDIA_BASE_URL")
        original_pathname = ""
        if settings.ON_RENDER and media_baseurl in self.image_full.url:
            base, pathname = self.image_full.url.split(sep=media_baseurl)
            original_pathname = pathname
        else:
            original_pathname = self.image_full.url
        results = {
            "blur": self.get_variant_url(self.blur_res, blur=True),
            "small": self.get_variant_url(self.small_res),
            "main": self.get_variant_url(self.main_res),
            "original": original_pathname,
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


class ImageGrid(models.Model):
    def __str__(self):
        return f"Image grid #{self.index}"

    index = models.PositiveIntegerField(unique=True, default=None)


class GridImage(Image):
    GRID_FRAME_FORMATS = {
        "wide": _("Wide"),
        "medium": _("Album medium"),
        "portrait": _("Protrait medium"),
        "small": _("Album small"),
    }
    # main_res = (2054, 736)
    # small_res = (1200, 368)

    tag = models.ManyToManyField(to="ImageTag", blank=True)
    format_in_grid = models.TextField(
        help_text=_(
            "Which frame format this image is for inside the mosaic image grid"
        ),
        choices=GRID_FRAME_FORMATS,
        blank=True,
    )
    grid = models.ForeignKey(
        to="ImageGrid",
        on_delete=models.CASCADE,
        default=1,
        related_name="grid_image",
        related_query_name="grid_images",
    )

    class Meta:
        verbose_name = _("grid image")
        verbose_name_plural = _("grid images")


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
    name = models.CharField(unique=True, max_length=63, verbose_name=_("name"))
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
        help_text=_("Link to an external resources with information about the place"),
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


class Review(models.Model):
    date = models.DateField(verbose_name=_("review date"))
    rating = models.FloatField(validators=[validate_rating_value])
    content = models.TextField()

    class Meta:
        verbose_name = _("review")
        verbose_name = _("reviews")
