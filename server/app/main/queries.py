from datetime import date, timedelta
from .models import Room


def get_available_rooms(check_in_str, nights):
    check_in = date.fromisoformat(check_in_str)
    check_out = check_in + timedelta(days=int(nights))
    available_rooms = Room.objects.exclude(
        room_reserved__reservation__check_in__lt=check_out,
        room_reserved__reservation__check_out__gt=check_in,
    )
    return available_rooms
