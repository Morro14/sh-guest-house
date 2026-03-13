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
import time
from .compute_mail_content import (
    get_res_confirmed_mail_content,
    get_res_validated_mail_content,
)

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
        log_context.__dict__
        if hasattr(log_context, "__dict__")
        else dict(log_context)
    )
    thread = threading.Thread(
        target=task, args=(task_args, log_context), daemon=True
    )
    thread.start()


@retry(times=3, delay=2)
def send_on_reservation_validated(params, log_context):
    from django.db import close_old_connections

    close_old_connections()

    log.info(
        "email_send_start",
    )
    if log_context:
        structlog.contextvars.bind_contextvars(**log_context)

    res_pk = params["instance_pk"]
    subject, html_body, text_body = get_res_validated_mail_content(res_pk)
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
    subject, html_body, text_body, email = get_res_confirmed_mail_content(
        res_pk
    )
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
