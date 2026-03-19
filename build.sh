# build command for deployment without dockerfile
pip install -r ./server/requirements.txt
npm install --prefix ./client/app
npm run --prefix ./client/app build
mkdir ./server/app/staticfiles/frontend
cp -r ./client/app/build/client/* ./server/app/staticfiles/frontend/
