# Inspecto API

## Authentication and Authorization

This project uses JWT (JSON Web Token) based authentication and role-based authorization for securing API endpoints.

### Authentication Flow
- **User Login**: Users authenticate via the `/signin` or `/signinAdmin` endpoints by providing their username and password.
- **Token Generation**: Upon successful login, a JWT token is generated and returned in the response (and/or set as a cookie for web clients).
- **Token Usage**: For subsequent requests to protected endpoints, the client must provide the JWT token in the `x-access-token` header or as a cookie (`token_app` or `token_manager`).

### Authorization Flow
- **Role-based Access**: The system distinguishes between regular users and admins. Admin login is handled via `/signinAdmin`.
- **Middleware**: Middleware functions (`authJwt`, `verifySignUp`, `userVerification`) are used to check the validity of JWT tokens and user roles before granting access to protected routes.
- **Token Verification**: The token is verified using a secret key defined in environment variables (`TOKEN_KEY` or `auth.config.js`). If the token is invalid or expired, access is denied.

### Security Notes
- Passwords are hashed using bcrypt before storage.
- JWT tokens are signed and verified using a secret key.
- CORS is enabled for cross-origin requests with credentials support.
- User input is validated to prevent duplicate usernames/emails and ensure data integrity.

### Example: Protected Request
```
GET /getAllUser
Headers:
  x-access-token: <your-jwt-token>
```

Or, for web clients:
- The token may be sent as a cookie (`token_app` or `token_manager`).

---

For more details, see the middleware in `app/middleware/` and the authentication logic in `app/controller/auth.controller.js`.
