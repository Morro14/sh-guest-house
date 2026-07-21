from django.contrib.auth.signals import (
    user_logged_in,
    user_logged_out,
    user_login_failed,
)
from django.db.models.signals import post_save
import structlog
from django.dispatch import receiver
from main.models import Reservation
from main.notifications.tasks import (
    send_on_reservation_validated,
    send_task_async,
)
from django.utils.translation import gettext_lazy as _
from django.conf import settings

log = structlog.get_logger()


@receiver(post_save, sender=Reservation)
def send_email_on_reservation_save(sender, instance, **kwargs):
    try:
        if instance.status == Reservation.Status.VALIDATED:
            log_context = structlog.contextvars.get_contextvars()
            email_body = _(
                "A reservation has been requested. Please check the reservation "
                "parameters and confirm or decline the reservation by following "
                "the link to the "
                "administrator site."
            )
            # send_task_async(
            #     send_on_reservation_validated,
            #     log_context,
            #     reservation=instance,
            #     email_body=email_body,
            #     email_title=_(
            #         "A new booking request for %(site_name)s has been received."
            #     )
            #     % {"site_name": settings.SITE_NAME},
            #     subject=_("Booking request is confirmed"),
            # )
        # elif instance.status == Reservation.Status.CONFIRMED:
        #     log_context = structlog.contextvars.get_contextvars()
        #     send_task_async(
        #         send_on_reservation_confirmed,
        #         log_context,
        #         instance_pk=instance.pk,
        #     )
    except Exception as e:
        print("EMAIL ERROR", e)
        log.error("email_send_error", error=e)


@receiver(user_logged_in)
def log_staff_user_logged_in(sender, request, user, **kwargs):
    if not user.is_staff:
        pass
    log.warning("staff_login", user_id=user.id, username=user.get_username())


@receiver(user_logged_out)
def log_staff_user_logged_out(sender, request, user, **kwargs):
    if not user.is_staff:
        pass
    log.warning("staff_logout", user_id=user.id, username=user.get_username())


@receiver(user_login_failed)
def log_staff_user_login_failed(sender, request, user, **kwargs):
    if not user.is_staff:
        pass
    log.warning("staff_loggin_failed", user_id=user.id, username=user.get_username())
