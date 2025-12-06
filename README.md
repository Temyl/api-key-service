# Auth API Documentation

## Overview

This project implements a modular authentication and API key management system using Node.js and TypeScript with the NestJS framework. It provides user signup, login, JWT-based authentication, and API key generation, listing, and revocation functionalities.

## Features

* User registration with email, password, and name
* Secure login with JWT token generation
* Protected routes using JWT guard
* API key creation with optional expiration
* API key listing and revocation

## Project Structure

```
src/
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      dto/
        user-signup.dto.ts
        user-login.dto.ts
        api-key.dto.ts
  guards/
    auth.guards.ts
  main.ts
```

## Endpoints

### POST /auth/signup

Registers a new user.
**Body**:

```
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response**:

```
{
  "id": "uuid",
  "email": "string",
  "name": "string"
}
```

### POST /auth/login

Logs in a user and returns a JWT token.
**Body**:

```
{
  "email": "string",
  "password": "string"
}
```

**Response**:

```
{
  "access_token": "jwt-token"
}
```

### POST /auth/keys

Creates a new API key for the authenticated user.
**Headers**:
Authorization: Bearer <token>

**Body**:

```
{
  "name": "string",
  "expiresAt": "ISO Date (optional)"
}
```

**Response**:

```
{
  "id": "uuid",
  "name": "string",
  "key": "string",
  "expiresAt": "ISO Date | null"
}
```
## Authentication

JWT tokens are issued during login and must be provided in the Authorization header to access protected endpoints.

## API Keys

API keys are owned by users and can optionally have an expiration time. Revoked keys are invalidated and should not be used.

## Error Handling

All endpoints return descriptive error messages for invalid input, unauthorized access, or resource conflicts.

## Setup

1. Install dependencies:

```
npm install
```

2. Configure environment variables in `.env`:

```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
```

3. Run development server:

```
npm run migration:generate
npm run migration: run
npm run start:dev
```

## Tests

Tests can be added using Jest to validate business logic and API behavior.

## Contributing

Pull requests and issues are welcome. Ensure compliance with project style and best practices before submitting.

## License

MIT
