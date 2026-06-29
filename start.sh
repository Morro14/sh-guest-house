sh -c "mkdir -p /var/data/db &&
  cd ./server/app/ &&
  cp -r /var/data/db/migrations/site_content/* ./site_content/migrations/ &&
  cp -r /var/data/db/migrations/main/* ./main/migrations/ &&
  cp -r /var/data/db/migrations/auth_app/* ./auth_app/migrations/ &&
  python manage.py makemigrations &&
  python manage.py migrate &&
  python manage.py createsuperuser --no-input || true &&
  python manage.py set_site &&
  python manage.py add_permissions &&
  python manage.py collectstatic --no-input &&
  gunicorn --bind 0.0.0.0:8000 app.wsgi:application"
