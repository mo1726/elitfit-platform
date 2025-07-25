# 🏋️ ElitFit Platform

ElitFit is a full-stack digital gym platform built to help gym administrators, coaches, and members manage their activities efficiently. The platform offers an intuitive dashboard, membership management, class booking, real-time statistics, and more.

---

## 📦 Tech Stack

### 🖥️ Frontend:
- **React.js**
- **Tailwind CSS**
- **React Router**
- **Axios**

### 🔧 Backend:
- **Spring Boot (Java)**
- **JWT Authentication**
- **RESTful APIs**
- **Spring Security**
- **MySQL Database**
- **Postman** (for API testing)

---

## 👥 Roles & Access

- **Admin**
  - Manage members & coaches
  - Add/update/delete gym classes
  - Track payments and platform analytics

- **Coach**
  - Manage assigned training sessions
  - Track class participants

- **Member**
  - Register and login
  - Book gym sessions
  - View their progress & class schedules

---



## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mo1726/elitfit-platform.git
```

cd backend

# Import to IntelliJ / Eclipse
# Setup MySQL DB: `elitfit_db` (import provided SQL file)
# Run the Spring Boot Application





spring.datasource.url=jdbc:mysql://localhost:3306/elitfit_db,       
spring.datasource.username=root,      
spring.datasource.password=your_password,




cd frontend,
npm install,
npm start




🔐 Authentication
JWT token is generated upon login and used to secure protected routes.

Role-based authorization is implemented for Admin, Coach, and Member.

