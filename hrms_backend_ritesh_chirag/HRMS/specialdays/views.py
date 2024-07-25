from .models import Holiday
from authApp.models import Employee
from .serializers import HolidaySerializer, BirthdaySerializer
from rest_framework import generics, permissions
from datetime import date, timedelta
from rest_framework_simplejwt.authentication import JWTAuthentication
# create by chirag


class HolidayListView(generics.ListCreateAPIView):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

    def get_permissions(self):
        if self.request.method in ["POST"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    

class HolidayDetailView(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAdminUser]
    permission_classes = [permissions.IsAdminUser]


class BirthdayListView(generics.ListAPIView):
    serializer_class = BirthdaySerializer

    def get_queryset(self):
        today = date.today()
        # one_month_later = today + timedelta(days=30)
        return Employee.objects.filter(dob__month=today.month)
