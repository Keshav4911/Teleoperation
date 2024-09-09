import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class RobotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Called when a new channel is created. 
        
        This performs the following operations:
        - Extracts the robot_id from the URL route.
        - Creates a channel layer group name from the robot_id.
        - Adds the user to the channel layer group.
        - Accepts the WebSocket connection.
        """
        self.robot_id = self.scope['url_route']['kwargs']['robot_id']
        self.room_group_name = f'robot_{self.robot_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        """
        Called when the WebSocket connection is closed.

        This removes the user from the channel layer group so that
        they are no longer sent messages from other users.
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Called when a message is received from the WebSocket.

        This function receives a JSON object from the WebSocket
        connection. It then checks the type of the message and
        calls the appropriate handler function.

        If the JSON object contains the key 'direction', the
        function calls `update_robot_position` with the value
        of the 'direction' key. It then sends a 'robot_update'
        message to the channel layer group with the direction.

        If the JSON object contains the key 'mission', the
        function calls `update_mission` with the value of the
        'mission' key. It then sends a 'mission_update' message
        to the channel layer group with the mission data.
        """
        data = json.loads(text_data)
        if 'direction' in data:
            # Handle robot movement
            direction = data['direction']
            await self.update_robot_position(direction)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'robot_update',
                    'direction': direction
                }
            )
        elif 'mission' in data:
            # Handle mission update
            mission_data = data['mission']
            await self.update_mission(mission_data)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'mission_update',
                    'mission': mission_data
                }
            )

    async def robot_update(self, event):
        """
        Called when a 'robot_update' message is received from the channel layer.
        Broadcasts the message to the websocket client.
        """
        direction = event['direction']

        await self.send(text_data=json.dumps({
            'direction': direction
        }))
    
    async def mission_update(self, event):
        """
        Called when a 'mission_update' message is received from the channel layer.
        Broadcasts the message to the websocket client.
        """
        mission = event['mission']

        await self.send(text_data=json.dumps({
            'mission': mission
        }))

    @database_sync_to_async
    def update_robot_position(self, direction):
        """
        Updates the position of the robot in the database.

        :param direction: The direction to move the robot in.
        :type direction: str

        :return: None
        """

        from .models import Robot
        robot = Robot.objects.get(id=self.robot_id)
        step = 20

        if direction == 'up':
            robot.pose_y = min(robot.pose_y + step, 480)
        elif direction == 'down':
            robot.pose_y = max(robot.pose_y - step, 0)
        elif direction == 'left':
            robot.pose_x = max(robot.pose_x - step, 0)
        elif direction == 'right':
            robot.pose_x = min(robot.pose_x + step, 640)

        robot.save()

    @database_sync_to_async
    def update_mission(self, mission_data):
        """
        Updates a mission in the database.

        :param mission_data: A dictionary with the mission data to update.
        :type mission_data: dict

        :return: None
        """
        from .models import Mission
        try:
            mission = Mission.objects.get(id=mission_data['id'])
            mission.name = mission_data.get('name', mission.name)
            mission.description = mission_data.get('description', mission.description)
            mission.robot_id = mission_data.get('robot_id', mission.robot_id)
            mission.save()
        except Mission.DoesNotExist:
            pass  # Handle the case where the mission doesn't exist
