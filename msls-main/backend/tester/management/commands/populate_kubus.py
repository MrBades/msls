import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tester.models import StarlinkKit
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Populates the database with 17 Kubus Engineering entries'

    def handle(self, *args, **kwargs):
        # Ensure we have a user to assign kits to
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(username='admin_demo', email='admin@example.com', password='password123')
            self.stdout.write(self.style.SUCCESS(f'Created demo user: {user.username}'))

        nigerian_states = [
            ("Lagos", 6.5244, 3.3792),
            ("Abuja", 9.0765, 7.3986),
            ("Kano", 12.0022, 8.5920),
            ("Ibadan", 7.3775, 3.9470),
            ("Port Harcourt", 4.8156, 7.0498),
            ("Benin City", 6.3350, 5.6037),
            ("Kaduna", 10.5105, 7.4165),
            ("Enugu", 6.4584, 7.5033),
            ("Jos", 9.8965, 8.8583),
            ("Ilorin", 8.4799, 4.5418),
            ("Maiduguri", 11.8311, 13.1501),
            ("Owerri", 5.4832, 7.0358),
            ("Akure", 7.2571, 5.2058),
            ("Abeokuta", 7.1475, 3.3619),
            ("Bauchi", 10.3103, 9.8439),
            ("Sokoto", 13.0059, 5.2476),
            ("Calabar", 4.9757, 8.3417),
        ]

        for i in range(1, 18):
            name = f"Kubus Engineering {i}"
            kit_id = f"KITP{random.randint(10000000, 99999999)}"
            slug = slugify(name)
            
            state_data = nigerian_states[i-1]
            status = random.choice(["Online", "Offline"])
            
            kit, created = StarlinkKit.objects.update_or_create(
                slug=slug,
                defaults={
                    'kit_id': kit_id,
                    'nickname': name,
                    'assigned_user': user,
                    'status': status,
                    'latitude': state_data[1],
                    'longitude': state_data[2],
                    'service_address': f"{state_data[0]}, Nigeria"
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created {name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated {name}'))

        self.stdout.write(self.style.SUCCESS('Successfully populated 17 Kubus Engineering entries'))
