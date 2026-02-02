import os
from celery import Celery

from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
print("celery app env", os.environ.get("DJANGO_SETTINGS_MODULE"))
app = Celery("app")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()
