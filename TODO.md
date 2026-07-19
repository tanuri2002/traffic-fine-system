# TODO

- [x] Create unified backend service `services/backend` combining auth + fines/payment logic.
- [x] Ensure combined backend runs on port 3000.
- [x] Add missing `POST /auth/register` endpoint to satisfy Flutter registration flow.
- [x] Update Flutter frontend to call a single backend base URL (remove auth/api split in config).
- [x] Remove `services/backend-auth` directory/files from repo.
- [ ] Update README(s) if any still reference `backend-auth`.

- [ ] Run backend (`npm install && npm start`) and validate endpoints.
- [ ] Run Flutter and validate flows: register/login/fine lookup/payment.
