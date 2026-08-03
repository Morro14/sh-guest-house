sh -c "mkdir -p /var/data/db &&
  cd ./server/app/ &&
  cp -r /var/data/db/migrations/site_content/* ./site_content/migrations/ &&
  cp -r /var/data/db/migrations/main/* ./main/migrations/ &&
  cp -r /var/data/db/migrations/auth_app/* ./auth_app/migrations/ &&
  python manage.py makemigrations &&
  python manage.py migrate &&
  cp -r ./site_content/migrations/ /var/data/db/migrations/site_content/* &&
  cp -r ./main/migrations/ /var/data/db/migrations/main/* &&
  cp -r ./auth_app/migrations/ /var/data/db/migrations/auth_app/* &&
  python manage.py createsuperuser --no-input || true &&
  python manage.py set_site &&
  python manage.py add_permissions &&
  python manage.py collectstatic --no-input &&
  python manage.py format_images
  python manage.py format_images_demo
  gunicorn --bind 0.0.0.0:8000 app.wsgi:application"
