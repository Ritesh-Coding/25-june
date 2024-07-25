from django.urls import path,include
from .views import LeaveEmployee,AdminGetLeaves,AdminLeaveApproval
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'leave', LeaveEmployee, basename='leave')
router.register(r'all-leaves',AdminGetLeaves,basename='get-leaves')

router.register(r'update-leave-status',AdminLeaveApproval,basename='update-leaves')

urlpatterns = [
    path('', include(router.urls)),
    
]