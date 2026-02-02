from django.core.mail import mail_admins, send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.contrib.sites.models import Site
from datetime import date
from celery import shared_task
from main.models import Reservation
from django.conf import settings
from django.http import HttpResponse
from django.utils import translation


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
)
def send_on_reservation_validated(self, res_pk):
    reservation = Reservation.objects.get(pk=res_pk)
    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name
        for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
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
    mail_admins(
        subject=subject,
        message=text_body,
        html_message=html_body,
        fail_silently=False,
    )


def send_on_reservation_confirmed(res_pk):
    reservation = Reservation.objects.get(pk=res_pk)
    lang = translation.get_language()
    print("django lang", lang)
    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name
        for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
    context = {
        "reservation": reservation,
        "site_name": _("project_name"),
        "site_url": domain,
        "current_year": date.today().year,
        "footer_message": _("project_name"),
        "rooms": rooms,
        "guests": guests,
        "manager_email": settings.MANAGERS[0] or "test_manager@email.com",
    }
    subject = _("Your reservation has been confirmed")
    html_body = render_to_string("emails/reservation_confirmed.txt", context)
    # text_body = render_to_string("emails/reservation_confirmed.txt", context)
    return HttpResponse(html_body, content_type="text/plain")
    # send_mail(
    #     subject=subject,
    #     message=text_body,
    #     html_message=html_body,
    #     fail_silently=False,
    # )
