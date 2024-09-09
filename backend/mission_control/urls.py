from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import RobotViewSet, MissionViewSet

router = DefaultRouter()
router.register(r'robots', RobotViewSet)
router.register(r'missions', MissionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
