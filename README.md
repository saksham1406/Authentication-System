# 🔐 Authentication System (Node.js + Express + MongoDB)

A scalable and secure authentication system built using Node.js, Express.js, and MongoDB. This project implements modern authentication practices including JWT-based access and refresh tokens, email verification, and password reset functionality.

## 🚀 Features

- User registration and login system
- JWT-based authentication (Access & Refresh Tokens)
- Secure password hashing using bcrypt
- Email verification and password reset using Nodemailer and Mailgen
- Protected routes using Express middleware
- Centralized error handling with custom API response/error classes
- Scalable backend architecture using Mongoose schemas
- Implementation of advanced JavaScript concepts (closures, higher-order functions, debouncing, throttling)

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- Nodemailer & Mailgen
- bcrypt

## 📂 Project Structure

- controllers/ → Business logic
- models/ → Mongoose schemas
- routes/ → API routes
- middlewares/ → Auth & error handling
- utils/ → Helper functions (ApiError, ApiResponse, etc.)

## 🔑 API Endpoints (Sample)

- POST /api/auth/register → Register new user
- POST /api/auth/login → Login user
- POST /api/auth/logout → Logout user
- POST /api/auth/refresh-token → Generate new access token
- POST /api/auth/forgot-password → Send reset email
- POST /api/auth/reset-password → Reset password

## ⚙️ Setup Instructions

1. Clone the repository
2. Install dependencies:
   npm install
3. Create a .env file and add:
   - MONGO_URI
   - JWT_SECRET
   - EMAIL credentials
4. Run the server:
   npm run dev

## 📌 Future Improvements

- Role-based access control (RBAC)
- OAuth (Google/GitHub login)
- Rate limiting & brute-force protection
- Docker containerization

## 📎 Author

Saksham Singh Rajput
