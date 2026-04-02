# Finance Data Processing and Access Control Backend

A simplified, robust backend system for managing financial records with role-based access control.

## 🚀 Overview
This project is built using **Node.js**, **Express**, and **MongoDB**. It allows users to track financial entries (income/expense) and provides a summary dashboard based on user roles. It fully implements all core requirements and several optional enhancements.

## 🌟 Implemented Enhancements (Bonus Features)
- **Pagination & Search**: Records API supports `?page=1&limit=10` and `?search=term`.
- **Soft Delete**: Records are not permanently deleted; an `isDeleted` flag is used.
- **Date Filtering**: Supports `?startDate=...&endDate=...` to find specific records.
- **Rate Limiting**: Protects APIs from brute-force/DDoS using `express-rate-limit`.
- **Validation**: Handled robustly to ensure no bad data crashes the app (returns `400 Bad Request`).

## 📂 Project Structure
```text
finance-backend/
├── config/             # Database configuration
├── middleware/         # Auth & Role-based middleware
├── models/             # Mongoose schemas (User, Record)
├── routes/             # API Endpoints (Auth, Records, Dashboard)
├── .env                # Secret keys and DB URL
└── server.js           # Application entry point
```

## 🔐 Key Features
1. **User & Role Management**:
   - Roles: `Admin` (Full access), `Analyst` (View & Summary), `Viewer` (View only).
   - User status tracking: `active` or `inactive`.
2. **Financial Records CRUD**:
   - Manage entries with `amount`, `type`, `category`, `date`, and `description`.
   - Supports filtering by `type` or `category`.
3. **Dashboard Summary**:
   - Calculates `Total Income`, `Total Expense`, and `Net Balance`.
   - Category-wise totals for better insights.
   - Shows the 5 most recent activities.
4. **Access Control**:
   - Custom middleware `checkRole` ensures only authorized users can perform sensitive actions (e.g., only Admin can create/delete).
5. **Security**:
   - Password hashing using `bcryptjs`.
   - Stateless authentication using `jsonwebtoken` (JWT).

## 🛠️ Setup Instructions
1. **Install Dependencies**: `npm install`
2. **Setup .env**: copy `.env.example` to `.env` and set values:
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_url` (e.g. `mongodb://localhost:27017/finance-db`)
   - `JWT_SECRET=your_secret_key`
3. **(Optional) Seed demo user**: `npm run seed` (creates `demo@example.com` / `password123` if missing)
4. **Run the Server**:
   - Production: `npm start`
   - Development (auto-reload): `npm run dev`

## 📡 API Endpoints
### Authentication
- `POST /api/auth/signup` - Register a user.
- `POST /api/auth/login` - Login and get JWT token.
### Records
- `GET /api/records` - View all records (supports filtering: `?type=income&category=Salary`).
- `POST /api/records` - Create record (Admin only).
- `PUT /api/records/:id` - Update record (Admin only).
- `DELETE /api/records/:id` - Delete record (Admin only).
### Dashboard
- `GET /api/dashboard` - Get totals and activity (Admin & Analyst only).

## 💡 Assumptions & Trade-offs
- **Simple Validation**: Used manual checks for required fields to keep the code clear for beginners.
- **In-Memory Filtering**: While production apps might use advanced DB queries, I used simple Mongoose filtering for readability.
- **Mock Persistence**: Using local MongoDB for ease of setup.
