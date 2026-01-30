from django.contrib import admin
from .models import StarlinkKit, SpeedTestResult

@admin.register(StarlinkKit)
class StarlinkKitAdmin(admin.ModelAdmin):
    list_display = ('nickname', 'kit_id', 'assigned_user', 'created_at')
    search_fields = ('nickname', 'kit_id', 'assigned_user__username')

@admin.register(SpeedTestResult)
class SpeedTestResultAdmin(admin.ModelAdmin):
    list_display = ('isp_name', 'download_speed_mbps', 'upload_speed_mbps', 'starlink_kit', 'created_at')
    list_filter = ('is_starlink', 'created_at')
    search_fields = ('isp_name', 'starlink_kit__nickname')
