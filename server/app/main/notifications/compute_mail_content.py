from main.models import Reservation
from django.shortcuts import get_object_or_404
from django.core.exceptions import BadRequest
from django.conf import settings
from datetime import date
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.contrib.sites.models import Site


def get_res_validated_mail_content(res_pk):
    reservation = get_object_or_404(Reservation, pk=res_pk)
    if not reservation:
        raise BadRequest

    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name
        for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
    print("guest type", type(guests["adults"]))
    context = {
        "reservation": reservation,
        "site_name": _(settings.SITE_NAME),
        "site_url": domain,
        "current_year": date.today().year,
        "footer_message": _(settings.SITE_NAME),
        "rooms": rooms,
        "guests": guests,
    }
    subject = "New reservation request"
    html_body = render_to_string("emails/reservation_request.html", context)
    text_body = render_to_string("emails/reservation_request.txt", context)
    return subject, html_body, text_body


def get_res_confirmed_mail_content(res_pk):
    reservation = get_object_or_404(Reservation, pk=res_pk)
    if not reservation:
        raise BadRequest

    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name
        for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
    print("guest type", type(guests["adults"]))
    context = {
        "reservation": reservation,
        "site_name": _(settings.SITE_NAME),
        "site_url": domain,
        "current_year": date.today().year,
        "footer_message": _(settings.SITE_NAME),
        "rooms": rooms,
        "guests": guests,
        "manager_email": settings.MANAGERS[0] or "test_manager@email.com",
    }
    subject = _("Your reservation has been confirmed")
    html_body = render_to_string(
        "emails/reservation_confirmed.html", context
    )
    text_body = render_to_string("emails/reservation_confirmed.txt", context)
    email = reservation.email
    return subject, html_body, text_body, email
