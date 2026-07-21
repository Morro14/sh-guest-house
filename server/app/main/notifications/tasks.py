from django.core.mail import mail_admins, send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.contrib.sites.models import Site
from datetime import date
from django.conf import settings
import structlog
from structlog.contextvars import clear_contextvars
import threading
import time

log = structlog.get_logger()


# @shared_task(
#     bind=True,
#     autoretry_for=(Exception,),
#     retry_kwargs={"max_retries": 3, "countdown": 10},
# )


def retry(times=3, delay=2):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1:
                        log.error("email_send_error", error=e)
                    time.sleep(delay)

        return wrapper

    return decorator


def send_task_async(task, log_context, **task_args):
    log_context = (
        log_context.__dict__ if hasattr(log_context, "__dict__") else dict(log_context)
    )
    thread = threading.Thread(target=task, args=(log_context, task_args), daemon=True)
    thread.start()


@retry(times=3, delay=2)
def send_on_reservation_validated(log_context, context):
    from django.db import close_old_connections

    close_old_connections()

    log.info(
        "email_send_start",
    )
    if log_context:
        structlog.contextvars.bind_contextvars(**log_context)
    reservation = context["reservation"]
    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name for room_reserved in reservation.rooms_reserved.all()
    ]
    print("TASKS ROOMS", rooms)
    guests = reservation.get_guests()
    context = {
        "reservation": reservation,
        "email_body": context["email_body"],
        "email_title": context["email_title"],
        "site_name": _(settings.SITE_NAME),
        "site_url": f"{domain}/admin",
        "admin_url": f"{domain}/admin/main/reservation/{reservation.pk}",
        "current_year": date.today().year,
        "footer_message": _(settings.SITE_NAME),
        "rooms": rooms,
        "guests": guests,
    }
    subject = "New reservation request"
    html_body = render_to_string("emails/on_res_validate.html", context)
    text_body = render_to_string("emails/on_res_validate.txt", context)
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


@retry(times=3, delay=2)
def send_to_client(log_context, context):
    from django.db import close_old_connections

    close_old_connections()
    reservation = context["reservation"]
    email_body = context["email_body"]
    # subject, html_body, text_body, email = get_res_confirmed_mail_content(
    #     res, email_body
    # )
    email_title = context["email_title"]
    current_site = Site.objects.get_current()
    domain = current_site.domain
    rooms = [
        room_reserved.room.name for room_reserved in reservation.rooms_reserved.all()
    ]
    guests = reservation.get_guests()
    tmpl_context = {
        # "title": _("Your reservation in %(site_name)s has been confirmed.")
        # % {"site_name": settings.SITE_NAME},
        "email_title": email_title,
        "email_body": email_body,
        "reservation": reservation,
        "site_name": _(settings.SITE_NAME),
        "site_url": domain,
        "current_year": date.today().year,
        "footer_message": _(settings.SITE_NAME),
        "rooms": rooms,
        "guests": guests,
        "manager_email": settings.MANAGERS[0] or "test_manager@email.com",
    }
    subject = context["subject"]
    html_body = render_to_string("emails/reservation_message.html", tmpl_context)
    text_body = render_to_string("emails/reservation_message.txt", tmpl_context)
    email = reservation.email
    if log_context:
        structlog.contextvars.bind_contextvars(**log_context)
    log.info(
        "email_send_start",
    )
    try:
        send_mail(
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
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
