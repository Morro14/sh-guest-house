sh -c "mkdir -p /var/data/db &&
  cd ./server/app/ &&
  python manage.py makemigrations &&
  python manage.py migrate &&
  python manage.py createsuperuser --no-input || true &&
  python manage.py set_site &&
  python manage.py add_permissions &&
  python manage.py seed_rooms &&
  python manage.py seed_images &&
  python manage.py seed_content &&
  python manage.py seed_places &&
  python manage.py gen_thumbnails &&
  python manage.py collectstatic --no-input &&
  gunicorn --bind 0.0.0.0:8000 app.wsgi:application"
