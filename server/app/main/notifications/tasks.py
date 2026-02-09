from django.core.mail import mail_admins, send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.contrib.sites.models import Site
from datetime import date
from celery import shared_task
from main.models import Reservation
from django.conf import settings
from django.http import HttpResponse
import structlog

log = structlog.get_logger()


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
)
def send_on_reservation_validated(self, res_pk, log_context):
    log.info(
        "email_send_start",
        task_id=self.request.id,
        retries=self.request.retries,
    )
    if log_context:
        structlog.contextvars.bind_contextvars(**log_context)

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
    try:
        mail_admins(
            subject=subject,
            message=text_body,
            html_message=html_body,
            fail_silently=False,
        )
    except Exception as e:
        log.warning(
            "email_send_retry",
            task_id=self.request.id,
            retries=self.request.retries,
            error=str(e),
        )

    log.info(
        "email_send_success",
        task_id=self.request.id,
        retries=self.request.retries,
    )


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 10},
)
def send_on_reservation_confirmed(self, res_pk, log_context=None):
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
        "manager_email": settings.MANAGERS[0] or "test_manager@email.com",
    }
    subject = _("Your reservation has been confirmed")
    html_body = render_to_string("emails/reservation_confirmed.txt", context)
    text_body = render_to_string("emails/reservation_confirmed.txt", context)

    if log_context:
        structlog.contextvars.bind_contextvars(**log_context)
    log.info(
        "email_send_start",
        task_id=self.request.id,
        retries=self.request.retries,
    )
    try:
        send_mail(
            subject=subject,
            message=text_body,
            html_message=html_body,
            fail_silently=False,
        )
    except Exception as e:
        log.warning(
            "email_send retry",
            task_id=self.request.id,
            retries=self.request.retries,
            error=str(e),
        )
        return
    log.info(
        "email_send_success",
        task_id=self.request.id,
        retries=self.request.retries,
    )


@shared_task
def test_celery():
    print("test celery")
