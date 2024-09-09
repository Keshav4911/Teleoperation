
# _Mission Control_

This repository contains the backend and frontend of the mission control application.

## Backend Setup Instructions

Use the following instructions to setup the backend.

``` bash
cd backend
python3 -m venv venv or python -m venv venv (If pyhton3 commands do not work on the user's system)
source venv/bin/activate or .\venv\Scripts\Activate (If using a Windows system)
pip install django djangorestframework django-cors-headers channels daphne
```

## Serving Backend

Use the following instructions in the terminal session used above to start the backend.

``` bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
daphne -b 0.0.0.0 -p 8000 mission_control.asgi:application
```

## Frontend Setup Instructions
In a new terminal run the following commands to setup and start the frontend application.

``` bash
cd frontend
npm install # or use npm install --legacy-peer-deps if there are any dependency conflicts
npm start
```
##Flow of Application
![Untitled diagram-2024-09-09-143552](https://github.com/user-attachments/assets/2e8b8f9a-9aeb-486e-8b9b-b0b450397a09)

## Usage Instructions
```
1)The application's home page is the "Mission Page".

2)On the Mission Page, there are two buttons: "Create New Mission" and "Create New Robot".

3)Clicking on the "Create New Robot" button opens a window where the user can enter the robot's name and model.

4)After entering the required information, the user can click "Save" to create a new robot.

5)Clicking on the "Create New Mission" button opens a window where the user can enter the mission name, mission description, and select a robot from a dropdown menu.

6)After filling in the required information, the user can click "Submit" to create a new mission.

7)Below the "Create New Mission" and "Create New Robot" buttons, there is a table that displays all the previously created missions.

8)The user can click on any mission in the table to view the mission details.

9)Within the mission details view, there is a "Simulate Robot" button.

10)Clicking on the "Simulate Robot" button opens a new window that contains a simulation area with a small robot in it.

11)On the right side of the simulation area, there are details about the robot.

12)Below the robot details, there is a joystick with four buttons (up, down, left, and right) that the user can click to move the robot in the respective directions.

13)The user can also use the WASD keys or the up, down, left, and right arrow keys to move the robot in the simulation area.
```

## Screenshots of every screen

# Mission Screen:
![Screenshot (30)](https://github.com/user-attachments/assets/b95add84-233a-4a7b-b331-6ca4a28a8d36)

# Create New Mission Screen:
![Screenshot (31)](https://github.com/user-attachments/assets/f3d8d1a5-d114-4d8d-97f5-434fb5b740ab)

# Create New Robot Screen:
![Screenshot (32)](https://github.com/user-attachments/assets/2dc39bec-f464-44b3-b77e-0ff96c371c25)

# Selected Mission Detail Screen:
![Screenshot (33)](https://github.com/user-attachments/assets/fe96de45-f1cb-4e24-8544-9935df46a1f3)

# Robot Simulation Screen:
![Screenshot (34)](https://github.com/user-attachments/assets/ea425f60-24f1-4da1-988f-32fb6fe41463)

## Usage Video Demo

https://www.loom.com/share/8635cdf6580e4e7d956548d556e21071?sid=fccb7bfc-19d3-434c-add4-94491b1446e7
