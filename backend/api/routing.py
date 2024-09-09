from django.urls import re_path
from .consumers import RobotConsumer

websocket_urlpatterns = [
    re_path(r'ws/robot/(?P<robot_id>\d+)/$', RobotConsumer.as_asgi()),
]
