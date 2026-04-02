# 📡 Finance API Documentation

This document provides details on how to interact with the Finance Data Processing and Access Control API.

## 🌍 Base URL
`http://localhost:5000` (Local Development)

---

## 🔐 Authentication
All protected routes require a JWT token in the `x-auth-token` header.

### 1. Signup
Create a new user account.
- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Body:**
```json
{
    "name": "Your Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "Admin" 
}
```
*(Roles: Admin, Analyst, Viewer)*

### 2. Login
Authenticate and receive a JWT token.
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Success Response:** `{"token": "eyJhbG..."}`

---

## 💰 Financial Records
*Note: Create, Update, and Delete are restricted to **Admin** role.*

### 1. Get All Records
Fetch financial entries with optional filtering.
- **URL:** `/api/records`
- **Method:** `GET`
- **Query Params:**
    - `type`: (Optional) `income` or `expense`
    - `category`: (Optional) e.g., `Salary`, `Food`, `Rent`
    - `search`: (Optional) Description keyword

### 2. Create Record
- **URL:** `/api/records`
- **Method:** `POST`
- **Body:**
```json
{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "description": "April Salary"
}
```

---

## 📊 Dashboard Summary
*Restricted to **Admin** and **Analyst** roles.*

### 1. Get Summary
Get totals, category breakdowns, and recent activity.
- **URL:** `/api/dashboard`
- **Method:** `GET`
- **Success Response:**
```json
{
    "totalIncome": 5000,
    "totalExpense": 1200,
    "balance": 3800,
    "categoryTotals": { ... },
    "recentActivity": [ ... ]
}
```

---

## 🛡️ Role-Based Access Table

| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| View Records | ✅ | ✅ | ✅ |
| Create/Edit/Delete | ✅ | ❌ | ❌ |
| Dashboard Access | ✅ | ✅ | ❌ |
