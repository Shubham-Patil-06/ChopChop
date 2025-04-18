#!/usr/bin/env bash
# build.sh

# install packages and prepare Django
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
