pip install -r ./server/requirements.txt
npm install --prefix ./client/app
npm run --prefix ./client/app build
cp -r ./client/app/build/client/* ./server/app/static/frontend/
python3 ./server/app/manage.py gen_thumbnails
python3 ./server/app/manage.py seed
python3 ./server/app/manage.py seed_content
python3 ./server/app/manage.py seed_images
python3 ./server/app/manage.py seed_places
python3 ./server/app/manage.py createsuperuser --no-input
python3 ./server/app/manage.py collectstatic --no-input
python3 ./server/app/manage.py migrate
