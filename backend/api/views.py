from rest_framework import viewsets
from .models import Robot, Mission
from .serializers import RobotSerializer, MissionSerializer

class RobotViewSet(viewsets.ModelViewSet):
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer

class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer
