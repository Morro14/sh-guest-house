from django.core.mail import mail_admins, send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.contrib.sites.models import Site
from datetime import date
from main.models import Reservation
from django.conf import settings
import structlog
from structlog.contextvars import clear_contextvars
import threading

log = structlog.get_logger()


# @shared_task(
#     bind=True,
#     autoretry_for=(Exception,),
#     retry_kwargs={"max_retries": 3, "countdown": 10},
# )
def send_task_async(task, log_context, **task_args):
    log_context = (
        log_context.__dict__
        if hasattr(log_context, "__dict__")
        else dict(log_context)
    )
    thread = threading.Thread(
        target=task, args=(task_args, log_context), daemon=True
    )
    thread.start()


def send_on_reservation_validated(params, log_context):
    from django.db import close_old_connections

    close_old_connections()

    log.info(
        "email_send_start",
    )
    if log_context:
        structlog.contextvars.bind_contextvars(**log_context)

    res_pk = params["instance_pk"]
    reservation = Reservation.objects.select_related().get(pk=res_pk)
    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name
        for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
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
    try:
        mail_admins(
            subject=subject,
            message=text_body,
            html_message=html_body,
            fail_silently=False,
        )
        log.info(
            "email_send_success",
        )
    except Exception as e:
        log.warning(
            "email_send_retry",
            error=str(e),
        )
    finally:
        clear_contextvars()
        close_old_connections()


def send_on_reservation_confirmed(params, log_context=None):
    from django.db import close_old_connections

    close_old_connections()
    res_pk = params["instance_pk"]
    reservation = Reservation.objects.select_related().get(pk=res_pk)
    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name
        for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
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
    if log_context:
        structlog.contextvars.bind_contextvars(**log_context)
    log.info(
        "email_send_start",
    )
    try:
        send_mail(
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[reservation.email],
            subject=subject,
            message=text_body,
            html_message=html_body,
            fail_silently=False,
        )
        log.info(
            "email_send_success",
        )
    except Exception as e:
        log.warning(
            "email_send retry",
            error=str(e),
        )
    finally:
        clear_contextvars()
        close_old_connections()
