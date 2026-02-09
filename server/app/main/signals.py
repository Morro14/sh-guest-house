from django.contrib.auth.signals import (
    user_logged_in,
    user_logged_out,
    user_login_failed,
)
import structlog
from django.dispatch import receiver
from celery.signals import task_failure

log = structlog.get_logger()


@receiver(user_logged_in)
def log_staff_user_logged_in(sender, request, user, **kwargs):
    if not user.is_staff:
        pass
    log.info("staff_login", user_id=user.id, username=user.get_username())


@receiver(user_logged_out)
def log_staff_user_logged_out(sender, request, user, **kwargs):
    if not user.is_staff:
        pass
    log.info("staff_logout", user_id=user.id, username=user.get_username())


@receiver(user_login_failed)
def log_staff_user_login_failed(sender, request, user, **kwargs):
    if not user.is_staff:
        pass
    log.info(
        "staff_loggin_failed", user_id=user.id, username=user.get_username()
    )


@task_failure.connect
def log_task_failuer(
    sender=None,
    task_id=None,
    exception=None,
    args=None,
    kwargs=None,
    traceback=None,
    einfo=None,
    **extra
):
    log.error(
        "celery_task_failed",
        task_id=task_id,
        task=sender.name,
        exception=str(exception),
    )
