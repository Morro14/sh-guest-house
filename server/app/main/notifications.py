from django.core.mail import mail_admins
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.contrib.sites.models import Site
from datetime import date


def send_on_reservation_validated(reservation):
    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name
        for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
    print("notification rooms", rooms, "guests", guests)
    context = {
        "reservation": reservation,
        "site_name": _("project_name"),
        "site_url": domain,
        "current_year": date.today().year,
        "footer_message": _("project_name"),
        "rooms": rooms,
        "guests": guests,
    }
    subject = "New reservation request"
    html_body = render_to_string("emails/reservation_request.html", context)
    text_body = render_to_string("emails/reservation_request.txt", context)
    mail_admins(subject=subject, message=text_body, html_message=html_body)
