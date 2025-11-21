# Project Walkthrough: Shopify + WhatsApp Integration (Vanilla JS + MySQL)

## Overview
This project implements a Shopify + WhatsApp Order Confirmation system using a simplified stack: FastAPI, MySQL, and Vanilla JavaScript (Bootstrap).

## Features
- **FastAPI Backend**: Robust API with SQLAlchemy.
- **MySQL Database**: Persistent storage for orders and logs.
- **Vanilla Frontend**: Lightweight dashboard using HTML, CSS, and Bootstrap.
- **Shopify Webhook**: Real-time order capture (`orders/create`).
- **WhatsApp Integration**: Interactive messages and webhook handling.
- **Smart Delays**: Configurable delays (using Celery Eager mode locally).

## Project Structure
```
/backend
  /app
    /api/v1/endpoints
      - webhooks.py
      - whatsapp_webhook.py
      - admin.py
    /core
      - config.py
    /db
      - models.py
      - database.py
    /services
      - whatsapp.py
      - shopify.py
      - courier.py
    /worker
      - celery_app.py
      - tasks.py
    - main.py
  /static
    /css
      - styles.css
    /js
      - app.js
    - index.html
  - requirements.txt
```

## How to Run
1.  **Prerequisites**:
    - Python 3.9+
    - MySQL Server running locally.

2.  **Configuration**:
    - Update `backend/app/core/config.py` with your MySQL credentials:
      ```python
      DATABASE_URL: str = "mysql+pymysql://root:password@localhost/shopify_whatsapp"
      ```
    - Ensure the database `shopify_whatsapp` exists in MySQL.

3.  **Install Dependencies**:
    ```powershell
    cd backend
    pip install -r requirements.txt
    ```

4.  **Run Server**:
    ```powershell
    uvicorn app.main:app --reload
    ```

5.  **Access Application**:
    - **Dashboard**: [http://localhost:8000](http://localhost:8000)
    - **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Notes
- **Celery**: Configured in "Eager Mode" for local development, meaning tasks run synchronously without Redis.
- **Frontend**: Served directly by FastAPI from the `/static` directory.
