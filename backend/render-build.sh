#!/usr/bin/env bash

echo "📦 Running Django migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "👤 Creating superuser if not exists..."
echo "
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ.get('SUPERUSER_NAME', 'admin')
email = os.environ.get('SUPERUSER_EMAIL', 'admin@chopchop.com')
password = os.environ.get('SUPERUSER_PASSWORD', 'adminpass')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print('✅ Superuser created')
else:
    print('ℹ️ Superuser already exists')
" | python manage.py shell
