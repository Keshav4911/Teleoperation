from rest_framework import serializers
from .models import Robot, Mission

class RobotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Robot
        fields = '__all__'

class MissionSerializer(serializers.ModelSerializer):
    robot = RobotSerializer(read_only=True)
    robot_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Mission
        fields = ['id', 'name', 'description', 'robot', 'robot_id']