mkdir /var/data/db
cd server/app
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser --no-input
python3 manage.py set_site
python3 manage.py add_permissions
python3 manage.py collectstatic --no-input
