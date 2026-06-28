# backend-auth

MySQL-backed REST API for the traffic fine system. This service handles JWT authentication, officer registration, category management, fine issuance, fine lookup, and payment status updates.

## What this service does

- Creates the MySQL database automatically on first run if your MySQL user has permission.
- Creates the required tables automatically on startup.
- Issues JWT tokens for authenticated requests.
- Lets officers register and log in.
- Lets admins create fine categories and mark fines as paid.

## From-zero setup

1. Install MySQL locally or use a remote MySQL server.
2. Create a folder environment file by copying `.env.example` to `.env`.
3. Fill in your MySQL connection values in `.env`.
4. Set `JWT_SECRET` to a strong random value.
5. Optionally set the `SEED_ADMIN_*` values if you want the app to create the first admin account on startup.
6. Run `npm install`.
7. Start the service with `npm run dev`.

If your MySQL user cannot create databases, import [schema.sql](schema.sql) manually into the database first, then start the service.

## Environment variables

Set these in `.env`:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

Optional admin bootstrap variables:

- `SEED_ADMIN_BADGE_NUMBER`
- `SEED_ADMIN_NAME`
- `SEED_ADMIN_PHONE`
- `SEED_ADMIN_DISTRICT`
- `SEED_ADMIN_PASSWORD`

## Database schema

The schema is defined in [schema.sql](schema.sql). The app will also initialize the same tables automatically when it starts.

## Main endpoints

- `POST /api/auth/register` - register an officer
- `POST /api/auth/login` - log in and receive a JWT
- `GET /api/categories` - list all categories
- `POST /api/categories` - create a category, admin only
- `GET /api/fines/lookup?referenceNumber=...&categoryId=...` - look up a fine for online payment
	- Backward compatible: `categoryCode` is also supported.
- `POST /api/fines` - issue a fine, officer/admin only
- `GET /api/fines/my` - list fines issued by the logged-in officer
- `PATCH /api/fines/:referenceNumber/pay` - mark a fine as paid, admin only

## Typical flow

1. Seed or create an admin account.
2. Log in as the admin and create traffic fine categories.
3. Register officers and log them in.
4. Officers issue fines through the API.
5. Web or mobile apps use the lookup endpoint to fetch fine details.
6. When payment is confirmed, the fine status is updated through the payment endpoint.
