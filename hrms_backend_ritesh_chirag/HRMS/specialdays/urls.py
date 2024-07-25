# employees/urls.py
from django.urls import path
from .views import HolidayListView, HolidayDetailView, BirthdayListView

# create by chirag

urlpatterns = [
    path('holidays/', HolidayListView.as_view(), name='holiday-list'),
    path('holidays/<int:pk>/', HolidayDetailView.as_view(), name='holiday-detail'),
    path('birthdays/', BirthdayListView.as_view(), name="birthday-list")
]