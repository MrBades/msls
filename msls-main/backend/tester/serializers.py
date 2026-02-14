from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SpeedTestResult, StarlinkKit, Ticket, ActivationRequest, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['must_change_password']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'profile']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.profile.must_change_password = True
        user.profile.save()
        return user

class StarlinkKitSerializer(serializers.ModelSerializer):
    assigned_user_email = serializers.EmailField(source='assigned_user.email', read_only=True)
    
    class Meta:
        model = StarlinkKit
        fields = ['id', 'kit_id', 'nickname', 'assigned_user', 'assigned_user_email', 'status', 'service_address', 'latitude', 'longitude', 'slug', 'created_at']
        read_only_fields = ['created_at']

    def validate_assigned_user(self, value):
        # Default behavior: assigned_user is mandatory in the model.
        # views.py will handle the default if not provided by admin.
        return value

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'user', 'subject', 'description', 'status', 'priority', 'created_at']
        read_only_fields = ['user', 'created_at']

class ActivationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivationRequest
        fields = ['id', 'user', 'kit_id', 'status', 'created_at']
        read_only_fields = ['user', 'created_at']

class SpeedTestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeedTestResult
        fields = ['id', 'starlink_kit', 'download_speed_mbps', 'upload_speed_mbps', 'latency_ms', 'jitter_ms', 'isp_name', 'is_starlink', 'client_ip', 'created_at']
        read_only_fields = ['starlink_kit', 'client_ip', 'created_at', 'isp_name', 'is_starlink']

class NetworkInfoSerializer(serializers.Serializer):
    ip = serializers.IPAddressField()
    isp = serializers.CharField()
    is_starlink = serializers.BooleanField()
    details = serializers.CharField(required=False)
