# Fullstack Authentication Application

This is a full-stack authentication application that allows users to register, log in, activate accounts via email, reset passwords, and update profile information. The project is built using modern web technologies and follows best security practices.

[Fullstack Authentication Application](https://fullstack-auth-app-client.vercel.app/)

## Tech Stack

### Frontend (Client)

- **React** (for building UI components)
- **Redux Toolkit** (for global state management)
- **React Router** (for client-side routing)
- **Formik / React Hook Form** (for form handling)

### Backend (Server)

- **Node.js + Express** (for API development)
- **Sequelize** (ORM for database operations)
- **PostgreSQL** (relational database)
- **bcrypt** (for password hashing)
- **jsonwebtoken (JWT)** (for authentication and session management)
- **nodemailer** (for email notifications)

### Deployment & CI/CD

- **Vercel** (for hosting both client and server applications)
- **Git & GitHub** (for version control and collaboration)

## Features

### Authentication & User Management

- **Register** using name, email, and password (only for non-authenticated users)
- **Password validation**: Users are informed about password rules and requirements
- **Email activation**: Users receive an activation email to confirm their account
- **Account activation page** (only for non-authenticated users)
- **Login** with valid credentials (email and password)
- **Inactive account warning**: Users must activate their email before logging in
- **Redirects**: After activation and login, users are redirected to their profile
- **Logout**: Users can log out and will be redirected to the login page

### Password Reset

- Request a password reset by providing an email
- Show a confirmation page after sending the reset email
- Reset password page with validation for password and confirmation fields
- Show a success page with a link to login

### Profile Management (Only Authenticated Users)

- Change name
- Change password (require old password, new password, and confirmation)
- Change email (require password confirmation and notify old email)

