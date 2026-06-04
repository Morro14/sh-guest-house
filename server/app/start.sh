#!/usr/bin/bash
mkdir ./staticfiles/frontend
cp -r ../../client/app/build/client/* ./staticfiles/frontend/
python manage.py makemigrations &&
python manage.py migrate &&
python manage.py createsuperuser --no-input || true &&
python manage.py set_site &&
python manage.py add_permissions &&
python manage.py collectstatic --no-input
