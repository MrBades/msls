"""
URL configuration for mystarlinkstats project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.http import JsonResponse

def catch_all_view(request, path=''):
    return JsonResponse({
        "error": "Not Found",
        "message": f"Endpoint '{path}' not found on backend. Did you mean to visit the frontend?",
        "hint": "Ensure you are using port 3000 for the frontend and port 8000 for the backend API."
    }, status=404)

urlpatterns = [
    path("admin/", admin.site.urls),
    # Use 'api/' as the prefix for our API endpoints
    path("api/", include('tester.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Catch-all
    path('<path:path>', catch_all_view),
]
