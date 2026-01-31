from rest_framework import serializers
from .models import SpeedTestResult, StarlinkKit, Ticket, ActivationRequest

class StarlinkKitSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarlinkKit
        fields = ['id', 'kit_id', 'nickname', 'assigned_user', 'status', 'service_address', 'latitude', 'longitude', 'slug', 'created_at']
        read_only_fields = ['assigned_user', 'created_at']

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
