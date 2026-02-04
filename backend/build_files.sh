#!/bin/bash

echo "===> INSTALLING REQUIREMENTS"
python3.12 -m pip install -r requirements.txt --break-system-packages

echo "===> RUNNING MIGRATIONS"
python3.12 manage.py migrate --noinput

echo "===> CREATING SUPERUSER"
# This command uses the variables you just added to Vercel
python3.12 manage.py createsuperuser --noinput || echo "Superuser already exists or failed to create"

echo "===> COLLECTING STATIC"
python3.12 manage.py collectstatic --noinput --clear

echo "===> BUILD FINISHED"
