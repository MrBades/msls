import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mystarlinkstats.settings')
django.setup()

User = get_user_model()

username = 'admin'
password = 'KBEN@1000'
email = 'akubuef@gmail.com'

try:
    user = User.objects.get(email=email)
    print(f"Superuser '{email}' already exists. Updating password...")
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"Superuser '{email}' updated successfully.")
except User.DoesNotExist:
    print(f"Creating superuser '{email}'...")
    User.objects.create_superuser(username=email, email=email, password=password)
    print(f"Superuser '{email}' created successfully.")
