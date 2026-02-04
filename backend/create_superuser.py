import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mystarlinkstats.settings')
django.setup()

User = get_user_model()

username = 'admin'
password = 'adminpassword'
email = 'admin@example.com'

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser '{username}'...")
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created successfully.")
    print(f"Password: {password}")
else:
    print(f"Superuser '{username}' already exists.")
