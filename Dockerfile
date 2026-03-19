FROM node:25.8-slim AS frontend-builder
WORKDIR /app/client
COPY client/app/package*.json ./
RUN npm install
COPY client/app/ ./
RUN npm run build

FROM python:3.14-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/app /app/server/app

RUN mkdir -p /app/server/app/staticfiles/frontend
COPY --from=frontend-builder /app/client/build/client/ /app/server/app/staticfiles/frontend/

WORKDIR /app/server/app
