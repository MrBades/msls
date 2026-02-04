from rest_framework import permissions

class IsKitOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a kit to view or edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        # WAIT, the requirement is "only authorized users can view or record data"
        # So strict ownership is required for everything on the Kit and its Results.
        
        # If the object is a StarlinkKit, check assigned_user
        if hasattr(obj, 'assigned_user'):
            return obj.assigned_user == request.user
            
        # If the object is a SpeedTestResult, check the kit's assigned_user
        if hasattr(obj, 'starlink_kit') and obj.starlink_kit:
            return obj.starlink_kit.assigned_user == request.user
            
        return False
