# backend-payment (demo)

Simple fines and payment server for local development.

Usage:

1. Install dependencies

```bash
cd services/backend-payment
npm install
```

2. Start the server

```bash
npm start
```

Defaults: server runs on `http://localhost:3000`. Configure with `.env` using `.env.example`.

Endpoints:
- `GET /fines?ref=TF...&category=CAT...` -> returns fine JSON or 404
- `POST /payments` (Authorization: Bearer <token>) -> process payment (returns success/failure)

This is a demo server — do not use in production.
