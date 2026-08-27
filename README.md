# SyncReserve

### Concurrent Reservation Management Platform

SyncReserve is a full-stack reservation management platform designed to handle concurrent seat reservations safely and prevent double booking.

The system demonstrates how database transactions, pessimistic locking, unique constraints, and role-based authentication can be used together to maintain data consistency when multiple users attempt to reserve the same seat at the same time.

---

## 📌 Overview

In a traditional reservation system, two or more users may attempt to reserve the same seat simultaneously.

For example:

> User A and User B both attempt to reserve Seat A10 for the same event at the same time.

Without proper concurrency control, both requests could potentially succeed, resulting in a **double booking**.

SyncReserve solves this problem by implementing concurrency control at the backend and database levels.

Only one request is allowed to successfully reserve a specific seat for an event, while conflicting requests are safely rejected.

---

## 🎯 Project Objectives

The main objectives of SyncReserve are:

- Prevent double booking during concurrent reservation requests
- Demonstrate real-world database concurrency control
- Implement secure authentication and authorization
- Provide role-based access for users and administrators
- Manage events and seats
- Allow users to create and cancel reservations
- Provide administrators with reservation, user management and event management tools
- Maintain data consistency using database constraints and transactions
- Build a clean and responsive user interface

---

## 🚀 Key Features

### 👤 User Features

- User registration
- Secure user login
- JWT-based authentication
- User dashboard
- Browse available events
- View event details
- View available seats
- Reserve seats
- View personal reservations
- Cancel reservations
- Profile management


---

### 🛠️ Administrator Features

Administrators have access to a dedicated administration area.

- Admin dashboard
- Manage users
- Manage events
- Create events
- Edit events
- Delete events
- Manage seats
- View all reservations
- Role-based protected admin routes

Administrators can access both:

- User Dashboard
- Admin Dashboard

The two dashboards are maintained as separate areas of the application.

---

