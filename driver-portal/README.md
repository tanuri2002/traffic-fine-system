# Driver Portal

Responsive static payment screen for the traffic fine workflow.

## What it does

- Looks up a fine with `GET /api/fines/lookup?referenceNumber=...&categoryId=...`
- Shows the fine summary fields on screen
- Submits payment with `POST /api/payments/complete`

## How to use

1. Serve this folder with any static file server.
2. Make sure `backend-auth` is running on `http://localhost:5001` or set `window.TRAFFIC_FINE_API_BASE_URL` before loading `app.js`.
3. Open `index.html` in a browser.

## Notes

- The screen is responsive, so it works on mobile and web widths.
- The payment form expects the fine to be loaded first so it can reuse the looked-up `referenceNumber` and `categoryId`.