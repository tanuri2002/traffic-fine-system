# backend (unified)

Unified auth + fines/payment backend for traffic fine system (demo).

## Run
```bash
cd services/backend
npm install
npm start
```

Defaults:
- Server runs on `http://localhost:3000`

## Endpoints
### Auth
- `POST /auth/login` { username, password } -> { access_token, refresh_token }
- `POST /auth/register` { username, password, name } -> issues demo tokens (demo-only)
- `POST /auth/refresh` { refresh_token } -> { access_token }
- `GET /auth/me` (Bearer token)

### App
- `GET /fines?ref=...&category=...`
- `POST /payments` (Bearer token)

