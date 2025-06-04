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

# Expense Tracker Frontend Setup

This section explains how to set up and run the React frontend for the Expense Tracker project.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Setup Instructions

### 1. Install Dependencies

Navigate to the `frontend` directory and install the required packages:

```
cd frontend
npm install
```

### 2. Start the Development Server

Run the following command inside the `frontend` directory:

```
npm run dev
```

The frontend will start at `http://localhost:5173/` by default. Open this URL in your browser to use the app.

---

# Expense Tracker Backend API

## Endpoints

### 1. POST /api/expenses/

**Description:** Create a new expense for the authenticated user.
**Request Body:**

```
{
  "title": "Lunch",
  "amount": "12.50",
  "category": "food", // one of: food, travel, utilities, misc
  "date": "2025-06-04",
  "notes": "Optional notes"
}
```

**Response:**

- 201 Created, returns the created expense object.

---

### 2. GET /api/expenses/

**Description:** List expenses for the authenticated user. Admins see all expenses.
**Query Params:**

- `start_date` (YYYY-MM-DD, optional)
- `end_date` (YYYY-MM-DD, optional)
- `category` (optional)
- `user` (admin only, optional)
  **Response:**
- 200 OK, returns a list of expense objects.

---

### 3. GET /api/expenses/<id>/

**Description:** Get details of a specific expense (must be owner or admin).
**Response:**

- 200 OK, returns the expense object.
- 404 Not Found if not found or not permitted.

---

### 4. PUT /api/expenses/<id>/

**Description:** Update an expense (must be owner or admin).
**Request Body:**

- Any updatable fields: title, amount, category, date, notes
  **Response:**
- 200 OK, returns the updated expense object.
- 404 Not Found if not found or not permitted.

---

### 5. DELETE /api/expenses/<id>/

**Description:** Delete an expense (must be owner or admin).
**Response:**

- 204 No Content on success.
- 404 Not Found if not found or not permitted.

---

### 6. GET /api/summary/

**Description:** Get totals by category for the authenticated user (or all users if admin).
**Response:**

```
[
  {"category": "food", "total": 100.00},
  {"category": "travel", "total": 50.00},
  ...
]
```

---

### 7. POST /api/get-token/

**Description:** Obtain an authentication token for a user.
**Request Body:**

```
{
  "username": "user",
  "password": "password"
}
```

**Response:**

- 200 OK, returns `{ "token": "...", "user_id": 1, "username": "user" }`
- 400 Bad Request if credentials are invalid.

---

**All endpoints require authentication via Token in the `Authorization: Token <token>` header.**

---

For further development or troubleshooting, refer to the Django documentation: https://docs.djangoproject.com/
