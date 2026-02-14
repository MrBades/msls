from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PingView, DownloadTestView, UploadTestView, NetworkInfoView, RegisterView,
    StarlinkKitViewSet, SpeedTestResultViewSet, TicketViewSet, ActivationRequestViewSet,
    AdminUserViewSet, ChangePasswordView, UserInfoView
)

router = DefaultRouter()
router.register(r'kits', StarlinkKitViewSet, basename='kit')
router.register(r'results', SpeedTestResultViewSet, basename='result')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'activation-requests', ActivationRequestViewSet, basename='activation-request')
router.register(r'users', AdminUserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('ping/', PingView.as_view(), name='ping'),
    path('download/', DownloadTestView.as_view(), name='download'),
    path('upload/', UploadTestView.as_view(), name='upload'),
    path('network-info/', NetworkInfoView.as_view(), name='network-info'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserInfoView.as_view(), name='me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
