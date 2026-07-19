"# Traffic Fine System"

Services and quick start

- `services/backend` — Unified auth + fines/payment service (demo)

- `mobile-app/flutter_ui` — Flutter mobile app UI

Quick start (run demo backends):

```bash
# Start auth server
# Start backend (unified)
cd services/backend
npm install
npm start



# Then run the Flutter app from mobile-app/flutter_ui
cd mobile-app/flutter_ui
flutter pub get
flutter run
```

The demo backends are minimal and intended for local development only.


The folder structure

TRAFFIC-FINE-SYSTEM
│
├── mobile-app/flutter_ui       ← Flutter application
│
└── services
    └── backend                 ← Node.js backend service


The data flow

Flutter App
      │
HTTP requests
      │
Node.js backend (backend)

      │
MySQL database (shared) 