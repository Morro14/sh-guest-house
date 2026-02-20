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
    send_on_reservation_confirmed,
    send_task_async,
)

log = structlog.get_logger()


@receiver(post_save, sender=Reservation)
def send_email_on_reservation_save(sender, instance, **kwargs):
    print("signal instance", instance)
    try:
        if instance.status == Reservation.Status.VALIDATED:
            log_context = structlog.contextvars.get_contextvars()
            send_task_async(
                send_on_reservation_validated,
                log_context,
                instance_pk=instance.pk,
            )
        elif instance.status == Reservation.Status.CONFIRMED:
            print("signal res cofnirmed")
            log_context = structlog.contextvars.get_contextvars()
            send_task_async(
                send_on_reservation_confirmed,
                log_context,
                instance_pk=instance.pk,
            )
    except Exception as e:
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
    log.warning(
        "staff_logout", user_id=user.id, username=user.get_username()
    )


@receiver(user_login_failed)
def log_staff_user_login_failed(sender, request, user, **kwargs):
    if not user.is_staff:
        pass
    log.warning(
        "staff_loggin_failed", user_id=user.id, username=user.get_username()
    )
