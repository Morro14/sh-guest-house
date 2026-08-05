from django.db import models
from main.models import ReservationBase, RoomBase
from site_content.models import (
    ImageBase,
    PlaceBase,
    ImageGridBase,
    ContentPageBase,
    ImageTagBase,
    ReviewBase,
)

from django.utils.translation import gettext_lazy as _


class ReservationDemo(ReservationBase):
    pass


class ContentPageDemo(ContentPageBase):
    pass


class ImageDemo(ImageBase):
    pass


class ImageTagDemo(ImageTagBase):
    pass


class WideImageDemo(ImageDemo):
    main_res = (2054, 736)
    small_res = (1200, 368)

    tag = models.ManyToManyField(to="ImageTagDemo", blank=True)

    class Meta:
        verbose_name = _("wide photo")
        verbose_name_plural = _("wide photos")


class ImageGridDemo(ImageGridBase):
    pass


class GridImageDemo(ImageDemo):
    GRID_FRAME_FORMATS = {
        "wide": _("Wide"),
        "medium": _("Album medium"),
        "portrait": _("Protrait medium"),
        "small": _("Album small"),
    }
    # main_res = (2054, 736)
    # small_res = (1200, 368)

    tag = models.ManyToManyField(to="ImageTagDemo", blank=True)
    format_in_grid = models.TextField(
        help_text=_(
            "Which frame format this image is for inside the mosaic image grid"
        ),
        choices=GRID_FRAME_FORMATS,
        blank=True,
    )
    grid = models.ForeignKey(
        to=ImageGridDemo,
        on_delete=models.SET_NULL,
        default=None,
        null=True,
        related_name="grid_image",
        related_query_name="grid_images",
    )

    class Meta:
        verbose_name = _("grid image")
        verbose_name_plural = _("grid images")


class RoomDemo(RoomBase):
    pass


class RoomImageDemo(ImageDemo):
    small_res = (700, 0)
    tiny_res = (20, 12)

    class Meta:
        verbose_name = _("room image")
        verbose_name_plural = _("room images")

    room = models.ForeignKey(
        to="RoomDemo",
        on_delete=models.CASCADE,
        related_name="image",
        related_query_name="images",
    )

    def __str__(self):
        return f"{self.room.name} #{self.order}"


class RoomReservedDemo(models.Model):
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
    room = models.ForeignKey(to=RoomDemo, on_delete=models.CASCADE)
    reservation = models.ForeignKey(
        to=ReservationDemo,
        on_delete=models.CASCADE,
        related_name="rooms_reserved",
        related_query_name="room_reserved",
    )


class PlaceDemo(PlaceBase):
    pass


class PlaceImageDemo(ImageDemo):
    small_res = (700, 400)
    place = models.ForeignKey(
        to=PlaceDemo,
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


class ReviewDemo(ReviewBase):
    pass
