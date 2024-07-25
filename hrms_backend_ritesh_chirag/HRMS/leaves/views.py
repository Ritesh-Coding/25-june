from django.shortcuts import render
from .models import Leaves,EmployeeLeaveAssignment
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions,viewsets
from .serializers import EmployeeLeaveSerializer,AdminLeaveSerializer,AdminLeaveUpdateSerializer,AssignedLeaveSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

#created By Ritesh
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 100
class LeaveEmployee(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    pagination_class = CustomPageNumberPagination
    filterset_fields = ['status']
    queryset = Leaves.objects.all()
    serializer_class = EmployeeLeaveSerializer

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            return Leaves.objects.filter(employee_id=self.request.user.id, date__range=[start_date, end_date]).all()
        return Leaves.objects.filter(employee_id=self.request.user.id)


class AssignedLeave(viewsets.ModelViewSet):
    queryset = EmployeeLeaveAssignment.objects.all() 
    authentication_classes = [JWTAuthentication]
    serializer_class = AssignedLeaveSerializer

    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    


#created By Ritesh
class AdminGetLeaves(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
     
    def get_queryset(self):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        print(start_date,"----------------------------",end_date)
        if start_date and end_date:
            print(start_date,"----------------------------",end_date)
            return Leaves.objects.filter(date__range=[start_date, end_date]).all()
        return Leaves.objects.filter().all()
    serializer_class = AdminLeaveSerializer

#created By Ritesh 
class AdminLeaveApproval(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAdminUser]
    queryset = Leaves.objects.all()
    serializer_class = AdminLeaveUpdateSerializer



          
 

        
    
