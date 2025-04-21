from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.analyze_csv, name='analyze_csv'),
]
