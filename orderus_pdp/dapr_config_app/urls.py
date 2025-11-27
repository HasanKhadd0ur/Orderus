
from django.urls import path
from . import views

urlpatterns = [
    path('dapr/config', views.dapr_config),
]