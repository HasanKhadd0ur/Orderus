from django.urls import path
from .views import authorize

urlpatterns = [
    path('authorize', authorize)
]

