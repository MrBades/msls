from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    must_change_password = models.BooleanField(default=False)

    def __str__(self):
        return f"Profile for {self.user.username}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if not hasattr(instance, 'profile'):
        UserProfile.objects.create(user=instance)
    instance.profile.save()

class StarlinkKit(models.Model):
    """
    Represents a specific Starlink hardware kit.
    """
    kit_id = models.CharField(max_length=100, unique=True, help_text="Unique Serial Number or Identifier for the Kit")
    nickname = models.CharField(max_length=100, help_text="Friendly name (e.g., 'Mobile Unit A')")
    assigned_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="kits")
    status = models.CharField(max_length=20, default="Offline")
    service_address = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    slug = models.SlugField(max_length=150, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nickname} ({self.kit_id})"

class Ticket(models.Model):
    """
    Support tickets for the user.
    """
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Closed', 'Closed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    subject = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    priority = models.CharField(max_length=20, default='Medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} ({self.status})"

class ActivationRequest(models.Model):
    """
    Pending hardware activation requests.
    """
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Denied', 'Denied'),
        ('Active', 'Active'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activation_requests")
    kit_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Activation Request for {self.kit_id} ({self.status})"

class SpeedTestResult(models.Model):
    """
    Stores the results of a network speed test.
    """
    starlink_kit = models.ForeignKey(StarlinkKit, on_delete=models.CASCADE, related_name="speed_tests", null=True, blank=True)
    download_speed_mbps = models.FloatField(help_text="Download speed in Megabits per second (Mbps)")
    upload_speed_mbps = models.FloatField(help_text="Upload speed in Megabits per second (Mbps)")
    latency_ms = models.FloatField(help_text="Round-trip time (ping) in milliseconds")
    jitter_ms = models.FloatField(help_text="Variance in latency in milliseconds")
    isp_name = models.CharField(max_length=255, help_text="Detected Internet Service Provider")
    is_starlink = models.BooleanField(default=False, help_text="True if the ISP is identified as Starlink")
    client_ip = models.GenericIPAddressField(null=True, blank=True, help_text="Public IP address of the client")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.isp_name} - D:{self.download_speed_mbps} U:{self.upload_speed_mbps} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"

    class Meta:
        ordering = ['-created_at']
