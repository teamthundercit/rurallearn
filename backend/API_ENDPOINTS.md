# User Management API Endpoints

## Overview
This document describes the user management endpoints implemented for the RuralLearn platform.

## Authentication
All endpoints require a valid Auth0 JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### GET /api/users/me
Get the current authenticated user's profile.

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "auth0Id": "auth0|123456789",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "student",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

### PUT /api/users/me
Update the current authenticated user's profile.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Jane Doe",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Validation Rules:**
- `name` (optional):
  - Must be a string
  - Cannot be empty
  - Maximum 100 characters
- `avatar` (optional):
  - Must be a valid URL string
  - Must start with http:// or https://
  - Maximum 500 characters

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "auth0Id": "auth0|123456789",
      "email": "user@example.com",
      "name": "Jane Doe",
      "role": "student",
      "avatar": "https://example.com/new-avatar.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input data",
      "details": ["Name cannot be empty", "Avatar must be a valid URL"]
    }
  }
  ```
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

---

## Implementation Details

### Service Layer (`services/userService.js`)
- `createOrUpdateUser(userData)`: Creates or updates user from Auth0 data
- `getUserProfile(auth0Id)`: Retrieves user profile by Auth0 ID
- `updateUserProfile(auth0Id, updates)`: Updates user profile with validation

### Controller Layer (`controllers/userController.js`)
- `getCurrentUser(req, res)`: Handles GET /api/users/me
- `updateCurrentUser(req, res)`: Handles PUT /api/users/me with input validation

### Middleware (`middleware/auth.js`)
- `checkJwt`: Verifies Auth0 JWT token
- `extractUserInfo`: Extracts user information from token

### Routes (`routes/userRoutes.js`)
- Defines the user API endpoints with authentication middleware

## Testing

To test these endpoints, you can use tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

Example cURL request:
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_AUTH0_TOKEN"
```

## Requirements Satisfied
- ✅ Requirement 1.2: User record creation/retrieval from MongoDB
- ✅ Requirement 2.1: Display user profile information
- ✅ Requirement 2.3: Error handling with user-friendly messages
