from django.contrib import admin
from django.urls import path
from django.urls import path, include
from dapr_config_app.views import dapr_subscribe   

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authorization.urls')),
    path('', include('dapr_config_app.urls')),
    path('dapr/subscribe', dapr_subscribe, name='dapr_subscribe'),
]
