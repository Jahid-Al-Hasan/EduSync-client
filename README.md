# 🎓 EduSync - Collaborative Learning Platform

**EduSync** is a full-stack web application designed to revolutionize learning through seamless collaboration, resource sharing, and intelligent session management.

---

## 🌐 Live Demo

- **Production URL**: [https://](https://)

---

## 🌐 Admin credentials

- **email**: admin@gmail.com
- **password**: admin@123

## ✨ Key Features

### 👥 Role-Based Experience

- **Admin Dashboard**: Manage users, approve or reject sessions with feedback, monitor platform activity, manage materials
- **Tutor Portal**: Create/manage sessions, upload materials, track bookings
- **Student Hub**: Discover sessions, access materials, submit reviews

### 🔐 Secure Authentication

- Email/password login with JWT
- Google OAuth integration
- Role-based protected routes
- Session management with HTTP-only cookies

### 🔐 Payment Integration

- Seamless Stripe integration for secure payments
- Dynamic pricing per session
- Real-time payment status tracking
- Automated booking confirmation upon successful payment

### 📚 Learning Tools

- Interactive session booking system
- Real-time availability updates
- Document sharing ( links, images)
- Peer review and rating system

### 🛠️ Technical Highlights

- Dark/light mode toggle
- Mobile-first responsive design
- Optimized performance with TanStack Query
- Secure Express API endpoints
- Form validation with React Hook Form

---

## 🛡️ Security Measures

- **Authentication**:

  - Firebase Auth with JWT verification
  - HTTP-only cookies for token storage
  - Automatic token refresh
  - Secure cookie clearance on logout

- **Authorization**:

  - Role-based access control (RBAC)
  - Protected API endpoints
  - Session timeout handling

- **Data Protection**:
  - Input sanitization
  - Environment variable encryption

---

## 🧰 Tech Stack

### Frontend

- **Framework**: React 19
- **Styling**: Tailwind CSS + daisyUI
- **State**: TanStack Query
- **Forms**: React Hook Form
- **Animation**: Framer Motion
- **Icons**: Lucide + React Icons
- **Routing**: React Router

### Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB
- **Auth**: Firebase Authentication

### DevOps

- **Bundler**: Vite
- **Environment**: dotenv

---
