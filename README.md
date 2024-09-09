
# _Mission Control_

This repository contains the backend and frontend of the mission control application.

## Backend Setup Instructions

Use the following instructions to setup the backend.

``` bash
cd backend
python3 -m venv venv or python -m venv venv (If pyhton3 commands do not work on the users system)
source venv/bin/activate or .\venv\Scripts\Activate (If using a windows system)
pip install django djangorestframework django-cors-headers channels daphne
```

## Serving Backend

Use the following instructions in the termincal session used above to start the backend.

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

## Usage Instructions

TODO: Add usage instructions here.

## Usage Demo

TODO: Add demo video here.

## Notes for @keshav

* Remove venv and node_modules, __pycache__,  directories and add it to .gitignore