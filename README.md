"# Traffic Fine System"

Services and quick start

- `services/backend-auth` — Authentication service (demo)
- `services/backend-payment` — Fines & payment service (demo)
- `mobile-app/flutter_ui` — Flutter mobile app UI

Quick start (run demo backends):

```bash
# Start auth server
cd services/backend-auth
npm install
cp .env.example .env
npm start

# In a new terminal: start payment server
cd services/backend-payment
npm install
cp .env.example .env
npm start

# Then run the Flutter app from mobile-app/flutter_ui
cd mobile-app/flutter_ui
flutter pub get
flutter run
```

The demo backends are minimal and intended for local development only.
