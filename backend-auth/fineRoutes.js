const express = require("express");
const {
  registerOfficer,
  loginOfficer,
  createCategory,
  listCategories,
  issueFine,
  lookupFine,
  listMyFines,
  markFineAsPaid,
  completeFinePayment,
  getDistrictCollections,
  getCategoryCollections
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
router.post("/payments/complete", completeFinePayment);
router.patch("/fines/:referenceNumber/pay", authMiddleware, requireRole("admin"), markFineAsPaid);

router.get("/admin/collections/districts", authMiddleware, requireRole("admin"), getDistrictCollections);
router.get("/admin/collections/categories", authMiddleware, requireRole("admin"), getCategoryCollections);

module.exports = router;
