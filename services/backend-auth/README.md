# backend-auth (demo)

Simple authentication server for local development.

Usage:

1. Install dependencies

```bash
cd services/backend-auth
npm install
```

2. Start the server

```bash
npm start
```

Defaults: server runs on `http://localhost:4000`. Configure with `.env` using `.env.example`.

Endpoints:
- `POST /auth/login` { username, password } -> { access_token, refresh_token }
- `POST /auth/refresh` { refresh_token } -> { access_token }
- `GET /auth/me` -> returns current user for valid token

This is a demo server — do not use in production.
