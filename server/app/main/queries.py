from datetime import date, timedelta
from .models import Reservation, Room
from django.db.models import OuterRef, Exists


def get_available_rooms(check_in_str, nights):
    check_in = date.fromisoformat(check_in_str)
    check_out = check_in + timedelta(days=int(nights))
    overlapping_res = Reservation.objects.filter(
        room_reserved=OuterRef("pk"),
        check_in__lt=check_out,
        check_out__gt=check_in,
    )
    available_rooms = Room.objects.annotate(
        is_reserved=Exists(overlapping_res)
    ).filter(is_reserved=False)
    return available_rooms
