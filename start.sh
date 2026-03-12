pip install -r ./server/requirements.txt
npm install --prefix ./client/app
npm run --prefix ./client/app build
cp -r ./client/app/build/client/* ./server/app/staticfiles/frontend/
cd server/app
python3 manage.py migrate
python3 manage.py seed
python3 manage.py seed_content
python3 manage.py seed_images
python3 manage.py seed_places
python3 manage.py collectstatic --no-input
python3 manage.py gen_thumbnails
python3 manage.py createsuperuser --no-input
