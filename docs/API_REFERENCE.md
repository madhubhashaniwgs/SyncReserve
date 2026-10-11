# SyncReserve API Reference

Base URL:

```text
http://localhost:8080/api
```

Authenticated requests use:

```http
Authorization: Bearer <jwt>
```

## Authentication

### Register

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Test User",
  "email": "user@example.com",
  "password": "StrongPass1"
}
```

Returns `201 Created`.

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "StrongPass1"
}
```

Returns a JWT and user summary.

### Request Password Code

```http
POST /auth/forgot-password
Content-Type: application/json
```

```json
{
  "email": "user@example.com"
}
```

The response is intentionally generic so the endpoint does not reveal whether an email is registered.

### Verify Password Code

```http
POST /auth/verify-reset-code
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

Returns a short-lived reset token.

### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json
```

```json
{
  "token": "temporary-reset-token",
  "newPassword": "NewStrongPass1"
}
```

### Change Password

```http
POST /auth/change-password
Authorization: Bearer <jwt>
Content-Type: application/json
```

```json
{
  "currentPassword": "StrongPass1",
  "newPassword": "NewStrongPass1"
}
```

## Events

### List Events

```http
GET /events
Authorization: Bearer <jwt>
```

### Get Event

```http
GET /events/{eventId}
Authorization: Bearer <jwt>
```

The response includes `totalSeats` and `availableSeats`.

### Create Event

Admin only:

```http
POST /events
Authorization: Bearer <admin-jwt>
Content-Type: application/json
```

```json
{
  "name": "Java Conference",
  "description": "Spring and Java conference",
  "eventDate": "2027-10-10T10:00:00",
  "location": "Colombo"
}
```

### Update Event

Admin only:

```http
PUT /events/{eventId}
Authorization: Bearer <admin-jwt>
Content-Type: application/json
```

### Delete Event

Admin only:

```http
DELETE /events/{eventId}
Authorization: Bearer <admin-jwt>
```

### Generate Seats

Admin only:

```http
POST /events/{eventId}/seats?rows=5&seatsPerRow=10
Authorization: Bearer <admin-jwt>
```

The backend supports labels such as `A1`, `B1`, `Z10`, and `AA1`.

### Get Seats

```http
GET /events/{eventId}/seats
Authorization: Bearer <jwt>
```

Each seat response includes its number and reservation status.

## Reservations

### Create Reservation

```http
POST /reservations
Authorization: Bearer <jwt>
Content-Type: application/json
```

```json
{
  "eventId": 1,
  "seatId": 10
}
```

Returns `201 Created`. A duplicate reservation returns `409 Conflict`.

### Get Current User Reservations

```http
GET /reservations/my
Authorization: Bearer <jwt>
```

### Cancel Reservation

```http
DELETE /reservations/{reservationId}
Authorization: Bearer <jwt>
```

A normal user can cancel only their own reservation. An admin can cancel any reservation.

### Get All Reservations

Admin only:

```http
GET /reservations
Authorization: Bearer <admin-jwt>
```

### Get Reservations by Event

Admin only:

```http
GET /reservations/event/{eventId}
Authorization: Bearer <admin-jwt>
```

## Admin Users

### List Users

```http
GET /admin/users
Authorization: Bearer <admin-jwt>
```

The API returns a controlled admin DTO instead of exposing the JPA `User` entity.

### Change User Role

```http
PUT /admin/users/{userId}/role?role=ADMIN
Authorization: Bearer <admin-jwt>
```

### Delete User

```http
DELETE /admin/users/{userId}
Authorization: Bearer <admin-jwt>
```

The API prevents self-deletion and deletion of the last administrator. User reservations are deleted before the account.

## Common Status Codes

- `200 OK`: successful read or update.
- `201 Created`: successful registration, event, or reservation creation.
- `204 No Content`: successful deletion.
- `400 Bad Request`: validation failure.
- `401 Unauthorized`: missing or invalid authentication.
- `403 Forbidden`: authenticated but insufficient role or ownership.
- `404 Not Found`: resource does not exist.
- `409 Conflict`: duplicate reservation or database constraint conflict.
