# Expense Tracker Backend Setup

This guide explains how to set up and run the Django backend server for the Expense Tracker project on your local machine.

## Prerequisites
- Python 3.11 or higher
- [pip](https://pip.pypa.io/en/stable/)
- (Recommended) [virtualenv](https://virtualenv.pypa.io/en/latest/) or Python venv for isolated environments

## Setup Instructions

### 1. Clone the Repository
Clone or download the project to your local machine.

### 2. Create and Activate a Virtual Environment
Navigate to the `backend` directory and create a virtual environment (if not already present):

```
# Windows (PowerShell)
python -m venv backend_env

# Activate the virtual environment
.\backend_env\Scripts\Activate.ps1
```

### 3. Install Dependencies
Install the required Python packages:

```
pip install -r backend/requirements.txt
```

### 4. Apply Migrations
Navigate to the `backend` directory and run:

```
cd backend
python manage.py migrate
```

### 5. Run the Development Server
Start the Django development server:

```
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/` by default.

### 6. Test the Server
You can test if the server is running by visiting the URL above in your browser. (API endpoints will be added as development continues.)

---

## Notes
- Make sure you are always working inside the virtual environment when running or developing the backend.
- If you encounter issues with dependencies, ensure your Python version matches the requirements.
- For admin access, create a superuser:
  ```
  python manage.py createsuperuser
  ```

---

For further development or troubleshooting, refer to the Django documentation: https://docs.djangoproject.com/
