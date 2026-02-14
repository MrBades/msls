import os
import time
import requests
from django.shortcuts import get_object_or_404
from django.http import StreamingHttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import BaseParser
from django.contrib.auth.models import User
from .models import SpeedTestResult, StarlinkKit, Ticket, ActivationRequest, UserProfile
from .serializers import (
    SpeedTestResultSerializer, StarlinkKitSerializer, NetworkInfoSerializer, 
    TicketSerializer, ActivationRequestSerializer, UserSerializer, UserCreateSerializer
)
from .permissions import IsKitOwner
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# --- Utilities ---

def get_client_ip_address(request):
    """
    Manually retrieve client IP. 
    In prod, this should rely on X-Forwarded-For if behind Nginx/load balancer.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_isp_info(ip_address):
    """
    Detects ISP using an external service.
    Note: For local development (127.0.0.1), this will return mock data.
    """
    if ip_address in ('127.0.0.1', '::1'):
        return {
            "query": ip_address,
            "status": "success",
            "isp": "Localhost Development",
            "org": "SpaceX Starlink (Mock)", # Mocking for dev verification
            "as": "AS14593 SpaceX Starlink"  # Mocking ASN
        }
    
    # Use a free API for demo purposes (e.g., ip-api.com).
    # In production, use a paid/reliable db (MaxMind).
    try:
        response = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=3)
        if response.status_code == 200:
            return response.json()
    except Exception:
        pass
    
    return {"isp": "Unknown", "org": "Unknown"}

# --- Parsers ---

class BinaryParser(BaseParser):
    """
    Plain binary parser for upload testing. 
    """
    media_type = '*/*'
    
    def parse(self, stream, media_type=None, parser_context=None):
        return stream

# --- ViewSets ---

class StarlinkKitViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Starlink Kits.
    Admins can see/edit all kits.
    Regular users only see/edit their own kits.
    """
    serializer_class = StarlinkKitSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        if self.request.user.is_staff:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsKitOwner()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return StarlinkKit.objects.all()
        return StarlinkKit.objects.filter(assigned_user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.is_staff and 'assigned_user' in self.request.data:
            serializer.save()
        else:
            serializer.save(assigned_user=self.request.user)


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Admin to manage Users.
    """
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.set_password(password)
        user.save()
        
        # Clear must_change_password flag
        if hasattr(user, 'profile'):
            user.profile.must_change_password = False
            user.profile.save()
            
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)


class SpeedTestResultViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing speed test results.
    Results must be linked to a Kit owned by the user.
    """
    serializer_class = SpeedTestResultSerializer
    permission_classes = [IsAuthenticated, IsKitOwner]

    def get_queryset(self):
        # Return results for all kits owned by the user, ordered by most recent
        queryset = SpeedTestResult.objects.filter(starlink_kit__assigned_user=self.request.user).order_by('-created_at')
        
        kit_id = self.request.query_params.get('starlink_kit')
        if kit_id:
            queryset = queryset.filter(starlink_kit__id=kit_id)
        
        # Pagination / Limit logic
        limit_param = self.request.query_params.get('limit', '50')
        if limit_param == 'all':
            return queryset
        
        try:
            limit = int(limit_param)
            return queryset[:limit]
        except ValueError:
            return queryset[:50]

    def perform_create(self, serializer):
        # Ensure the kit ID passed belongs to the user
        kit_id = self.request.data.get('starlink_kit')
        kit = get_object_or_404(StarlinkKit, id=kit_id, assigned_user=self.request.user)
        
        # Auto-detect IP info if not provided
        client_ip = get_client_ip_address(self.request)
        isp_data = get_isp_info(client_ip)
        isp_name = isp_data.get('isp', '') or isp_data.get('org', '')
        is_starlink = "Starlink" in isp_name or "SpaceX" in isp_name or "14593" in isp_data.get('as', '')

        serializer.save(
            starlink_kit=kit,
            client_ip=client_ip,
            isp_name=isp_name,
            is_starlink=is_starlink
        )

class TicketViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing support tickets.
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ActivationRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint for hardware activation requests.
    Supports filtering by status (e.g., ?status=Pending).
    """
    serializer_class = ActivationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ActivationRequest.objects.filter(user=self.request.user).order_by('-created_at')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- Test Utility Views (Public) ---

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        name = request.data.get('username') # This is Full Name from frontend
        password = request.data.get('password')
        email = request.data.get('email')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth.models import User
        if User.objects.filter(username=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # We use email as the username for Django's authentication system
        user = User.objects.create_user(username=email, password=password, email=email, first_name=name)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class PingView(APIView):
    authentication_classes = [] 
    permission_classes = []
    def get(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)

class DownloadTestView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        try:
            size = int(request.query_params.get('size', 10 * 1024 * 1024))
            size = min(size, 100 * 1024 * 1024) 
        except ValueError:
            size = 10 * 1024 * 1024

        # Optimization: Pre-generate a chunk of data to reuse
        # os.urandom is CPU intensive. We'll generate 1MB once and cycle it.
        chunk_size = 1024 * 1024  # 1 MB
        static_chunk = os.urandom(chunk_size)

        def file_iterator(file_size):
            bytes_generated = 0
            while bytes_generated < file_size:
                needed = file_size - bytes_generated
                if needed >= chunk_size:
                    yield static_chunk
                    bytes_generated += chunk_size
                else:
                    yield static_chunk[:needed]
                    bytes_generated += needed

        response = StreamingHttpResponse(
            file_iterator(size),
            content_type='application/octet-stream'
        )
        response['Content-Length'] = size
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response

class UploadTestView(APIView):
    authentication_classes = []
    permission_classes = []
    parser_classes = [BinaryParser]

    def post(self, request):
        start_time = time.time()
        stream = request.data
        total_bytes = 0
        
        if hasattr(stream, 'read'):
            while True:
                chunk = stream.read(65536)
                if not chunk: break
                total_bytes += len(chunk)
        elif isinstance(stream, bytes):
            total_bytes = len(stream)
        
        duration = time.time() - start_time
        if duration == 0: duration = 0.0001
        
        mbps = (total_bytes * 8) / (duration * 1000000)
        
        return Response({
            "received_bytes": total_bytes,
            "duration_seconds": duration,
            "calculated_mbps": mbps
        }, status=status.HTTP_200_OK)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class NetworkInfoView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        ip = get_client_ip_address(request)
        isp_data = get_isp_info(ip)
        isp_name = isp_data.get('isp', '') or isp_data.get('org', '')
        is_starlink = "Starlink" in isp_name or "SpaceX" in isp_name
        if "14593" in isp_data.get('as', ''): is_starlink = True

        data = {
            "ip": ip,
            "isp": isp_name,
            "is_starlink": is_starlink,
            "details": str(isp_data)
        }
        return Response(NetworkInfoSerializer(data).data)
