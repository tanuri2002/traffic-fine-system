const express = require("express");
const {
  registerOfficer,
  loginOfficer,
  createCategory,
  listCategories,
  issueFine,
  lookupFine,
  listMyFines,
  markFineAsPaid
} = require("./fineController");
const { authMiddleware, requireRole } = require("./authMiddleware");

const router = express.Router();

router.post("/auth/register", registerOfficer);
router.post("/auth/login", loginOfficer);

router.get("/categories", listCategories);
router.post("/categories", authMiddleware, requireRole("admin"), createCategory);

router.get("/fines/lookup", lookupFine);
router.post("/fines", authMiddleware, requireRole("officer", "admin"), issueFine);
router.get("/fines/my", authMiddleware, requireRole("officer", "admin"), listMyFines);
router.patch("/fines/:referenceNumber/pay", authMiddleware, requireRole("admin"), markFineAsPaid);

module.exports = router;
