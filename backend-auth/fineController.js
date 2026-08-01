const bcrypt = require("bcryptjs");
const Fine = require("./Fine");
const Category = require("./Category");
const Officer = require("./Officer");
const { generateToken } = require("./jwtUtil");

function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function normalizeRef(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function generateReferenceNumber() {
  return `REF-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function trimString(value) {
  return String(value || "").trim();
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function parseAmountLkr(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

function isPositiveIntegerLike(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

function normalizeDateInput(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 19).replace("T", " ");
}

function resolvePaymentChannel(value) {
  const normalized = normalizeCode(value);
  if (normalized === "MOBILE" || normalized === "WEB") {
    return normalized;
  }

  return null;
}

function getPaymentStatus(fine) {
  return fine?.status === "PAID" ? "APPROVED" : "PENDING";
}

function ensureAdminAccess(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return false;
  }

  return true;
}

function formatFinePaymentResponse(fine) {
  if (!fine) {
    return null;
  }

  return {
    referenceNumber: fine.referenceNumber,
    driverName: fine.driverName,
    vehicleNo: fine.vehicleNo,
    offense: fine.category ? fine.category.title : null,
    fineAmount: fine.category ? fine.category.amountLkr : null,
    date: fine.createdAt,
    status: fine.status,
    paymentStatus: getPaymentStatus(fine),
    paidAt: fine.paidAt,
    paymentChannel: fine.paymentChannel,
    category: fine.category,
    officer: fine.officer
  };
}

function sendPaymentNotificationToOfficer(fineWithDetails) {
  if (!fineWithDetails || !fineWithDetails.officer) {
    return;
  }

  // Placeholder hook for SMS integration; replace with SMS provider call.
  console.log(
    `Payment notification queued for officer ${fineWithDetails.officer.badgeNumber} (${fineWithDetails.officer.phone}) on fine ${fineWithDetails.referenceNumber}`
  );
}

async function registerOfficer(req, res, next) {
  try {
    const { badgeNumber, name, phone, district, password } = req.body;

    if (!isNonEmptyString(badgeNumber) || !isNonEmptyString(name) || !isNonEmptyString(phone) || !isNonEmptyString(district) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: "badgeNumber, name, phone, district, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedBadgeNumber = trimString(badgeNumber);
    const normalizedName = trimString(name);
    const normalizedPhone = trimString(phone);
    const normalizedDistrict = trimString(district);
    const registryOfficer = await Officer.findOfficerRegistryByBadgeNumber(normalizedBadgeNumber);

    if (!registryOfficer) {
      return res.status(403).json({ message: "Badge number not recognized. Contact your administrator." });
    }

    const registryName = trimString(registryOfficer.name);
    const registryPhone = trimString(registryOfficer.phone);
    const registryDistrict = trimString(registryOfficer.district);

    if (
      registryName.toLowerCase() !== normalizedName.toLowerCase() ||
      registryPhone.toLowerCase() !== normalizedPhone.toLowerCase() ||
      registryDistrict.toLowerCase() !== normalizedDistrict.toLowerCase()
    ) {
      return res.status(403).json({ message: "Officer details do not match the admin-approved registry entry. Contact your administrator." });
    }

    const existing = await Officer.findOfficerByBadgeNumber(normalizedBadgeNumber);
    if (existing) {
      return res.status(409).json({ message: "Officer already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const officer = await Officer.createOfficer({
      badgeNumber: normalizedBadgeNumber,
      name: trimString(name),
      phone: trimString(phone),
      district: trimString(district),
      passwordHash,
      role: "officer"
    });

    return res.status(201).json({
      id: officer.id,
      badgeNumber: officer.badgeNumber,
      name: officer.name,
      phone: officer.phone,
      district: officer.district,
      role: officer.role,
      createdAt: officer.createdAt,
      updatedAt: officer.updatedAt
    });
  } catch (error) {
    return next(error);
  }
}

async function loginOfficer(req, res, next) {
  try {
    const { badgeNumber, password } = req.body;

    if (!isNonEmptyString(badgeNumber) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: "badgeNumber and password are required" });
    }

    let officer = await Officer.findOfficerByBadgeNumber(trimString(badgeNumber));
    if (!officer) {
      const { getPool } = require("./db");
      const [adminRows] = await getPool().query(
        "SELECT * FROM administrators WHERE badge_number = ? LIMIT 1",
        [trimString(badgeNumber)]
      );
      if (adminRows.length > 0) {
        const adminRow = adminRows[0];
        officer = {
          id: adminRow.id,
          badgeNumber: adminRow.badge_number,
          name: adminRow.full_name,
          fullName: adminRow.full_name,
          officialEmail: adminRow.official_email,
          phone: "",
          district: "",
          passwordHash: adminRow.password_hash,
          role: "admin",
          createdAt: adminRow.created_at,
          updatedAt: adminRow.updated_at
        };
      }
    }

    if (!officer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, officer.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      officerId: String(officer.id),
      badgeNumber: officer.badgeNumber,
      role: officer.role
    });

    return res.status(200).json({
      token,
      officer: {
        id: officer.id,
        badgeNumber: officer.badgeNumber,
        name: officer.name,
        fullName: officer.fullName || officer.name,
        officialEmail: officer.officialEmail || "",
        phone: officer.phone,
        district: officer.district,
        role: officer.role,
        createdAt: officer.createdAt,
        updatedAt: officer.updatedAt
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    if (!ensureAdminAccess(req, res)) {
      return;
    }

    const { code, title, amountLkr, description } = req.body;

    const normalizedCode = normalizeCode(code);
    const normalizedTitle = trimString(title);
    const parsedAmount = parseAmountLkr(amountLkr);

    if (!normalizedCode || !normalizedTitle || parsedAmount === null) {
      return res.status(400).json({ message: "code, title, amountLkr are required" });
    }

    const existing = await Category.findCategoryByCode(normalizedCode);
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.createCategory({
      code: normalizedCode,
      title: normalizedTitle,
      amountLkr: parsedAmount,
      description: trimString(description)
    });

    return res.status(201).json(category);
  } catch (error) {
    return next(error);
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await Category.listCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return next(error);
  }
}

async function issueFine(req, res, next) {
  try {
    const {
      referenceNumber,
      categoryCode,
      categoryId,
      driverLicenseNo,
      driverName,
      vehicleNo
    } = req.body;

    const normalizedCategoryCode = normalizeCode(categoryCode || categoryId);
    const normalizedVehicleNo = normalizeCode(vehicleNo);

    // referenceNumber, driverLicenseNo, driverName are optional so the
    // mobile app (which only sends category + vehicleNo) keeps working.
    // Web clients can still send them explicitly for full detail capture.
    const normalizedReference = normalizeRef(referenceNumber || generateReferenceNumber());
    const normalizedDriverLicenseNo = normalizeCode(driverLicenseNo || "UNKNOWN");
    const normalizedDriverName = trimString(driverName) || "UNKNOWN";

    if (!normalizedCategoryCode || !normalizedVehicleNo) {
      return res.status(400).json({
        message: "categoryCode/categoryId and vehicleNo are required"
      });
    }

    const existingFine = await Fine.findFineByReference(normalizedReference);
    if (existingFine) {
      return res.status(409).json({ message: "Fine reference number already exists" });
    }

    const category = await Category.findCategoryByCode(normalizedCategoryCode);
    if (!category) {
      return res.status(404).json({ message: "Invalid category code" });
    }

    const fine = await Fine.createFine({
      referenceNumber: normalizedReference,
      categoryId: category.id,
      officerId: req.user.officerId,
      driverLicenseNo: normalizedDriverLicenseNo,
      driverName: normalizedDriverName,
      vehicleNo: normalizedVehicleNo
    });

    const fineWithDetails = await Fine.findFineByReferenceWithDetails(fine.referenceNumber);
    return res.status(201).json(fineWithDetails);
  } catch (error) {
    return next(error);
  }
}

async function lookupFine(req, res, next) {
  try {
    const { referenceNumber, categoryCode, categoryId } = req.query;

    if (!isNonEmptyString(referenceNumber) || (!isNonEmptyString(categoryCode) && !isPositiveIntegerLike(categoryId))) {
      return res.status(400).json({ message: "referenceNumber and either categoryCode or categoryId are required" });
    }

    const fine = await Fine.findFineByReferenceWithDetails(normalizeRef(referenceNumber));

    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    if (categoryCode && fine.category.code !== normalizeCode(categoryCode)) {
      return res.status(404).json({ message: "Fine not found for this category" });
    }

    if (isPositiveIntegerLike(categoryId) && Number(fine.category.id) !== Number(categoryId)) {
      return res.status(404).json({ message: "Fine not found for this category" });
    }

    return res.status(200).json({
      ...formatFinePaymentResponse(fine),
      amountLkr: fine.category.amountLkr,
      officer: fine.officer,
      issuedAt: fine.createdAt,
      paidAt: fine.paidAt,
      requestedCategoryCode: categoryCode || null,
      requestedCategoryId: categoryId || null
    });
  } catch (error) {
    return next(error);
  }
}

async function listMyFines(req, res, next) {
  try {
    const fines = await Fine.listFinesByOfficerId(req.user.officerId);

    return res.status(200).json(fines);
  } catch (error) {
    return next(error);
  }
}

async function markFineAsPaid(req, res, next) {
  try {
    if (!ensureAdminAccess(req, res)) {
      return;
    }

    const referenceNumber = normalizeRef(req.params.referenceNumber);
    const { channel } = req.body;

    if (!referenceNumber) {
      return res.status(400).json({ message: "referenceNumber is required" });
    }

    if (channel !== undefined && channel !== null && !resolvePaymentChannel(channel)) {
      return res.status(400).json({ message: "channel must be either MOBILE or WEB" });
    }

    const fine = await Fine.findFineByReference(referenceNumber);
    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    if (fine.status === "PAID") {
      return res.status(200).json({ message: "Fine already paid", fine });
    }

    const paymentChannel = resolvePaymentChannel(channel) || "WEB";

    const updatedFine = await Fine.updateFineAsPaid(referenceNumber, paymentChannel);

    return res.status(200).json({
      message: "Fine marked as paid",
      fine: {
        ...updatedFine,
        status: "PAID",
        paymentStatus: "APPROVED"
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function completeFinePayment(req, res, next) {
  try {
    const { referenceNumber, categoryCode, categoryId, channel, cardholderName, cardNumber, expiryDate, cvv } = req.body;

    if (!isNonEmptyString(referenceNumber) || (!isNonEmptyString(categoryCode) && !isPositiveIntegerLike(categoryId))) {
      return res.status(400).json({
        message: "referenceNumber and either categoryCode or categoryId are required"
      });
    }

    const paymentChannel = resolvePaymentChannel(channel);
    if (!paymentChannel) {
      return res.status(400).json({ message: "channel must be either MOBILE or WEB" });
    }

    if (!isNonEmptyString(cardholderName)) {
      return res.status(400).json({ message: "cardholderName is required" });
    }

    const cardNumberRegex = /^\d{13,19}$/;
    if (!isNonEmptyString(cardNumber) || !cardNumberRegex.test(cardNumber.replace(/\s+/g, ""))) {
      return res.status(400).json({ message: "Invalid card number format" });
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!isNonEmptyString(expiryDate) || !expiryRegex.test(expiryDate.trim())) {
      return res.status(400).json({ message: "Invalid expiry date format. Expected MM/YY" });
    }

    const cvvRegex = /^\d{3,4}$/;
    if (!isNonEmptyString(cvv) || !cvvRegex.test(cvv.trim())) {
      return res.status(400).json({ message: "Invalid CVV format" });
    }

    const fine = await Fine.findFineByReferenceWithDetails(normalizeRef(referenceNumber));

    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    if (categoryCode && fine.category.code !== normalizeCode(categoryCode)) {
      return res.status(404).json({ message: "Fine not found for this category" });
    }

    if (isPositiveIntegerLike(categoryId) && Number(fine.category.id) !== Number(categoryId)) {
      return res.status(404).json({ message: "Fine not found for this category" });
    }

    if (fine.status === "PAID") {
      return res.status(200).json({
        message: "Fine already paid",
        fine: formatFinePaymentResponse(fine)
      });
    }

    await Fine.updateFineAsPaidIfUnpaid(fine.referenceNumber, paymentChannel);
    await Fine.createPayment({
      fineId: fine.id,
      cardholderName,
      cardNumber: cardNumber.replace(/\s+/g, ""),
      expiryDate: expiryDate.trim(),
      cvv: cvv.trim()
    });

    const paidFine = await Fine.findPaidFineByReferenceWithDetails(fine.referenceNumber);
    sendPaymentNotificationToOfficer(paidFine);

    return res.status(200).json({
      message: "Payment completed successfully",
      fine: formatFinePaymentResponse(paidFine)
    });
  } catch (error) {
    return next(error);
  }
}

async function getDistrictCollections(req, res, next) {
  try {
    const startDate = normalizeDateInput(req.query.startDate);
    const endDate = normalizeDateInput(req.query.endDate);

    if ((req.query.startDate && !startDate) || (req.query.endDate && !endDate)) {
      return res.status(400).json({ message: "Invalid startDate or endDate format" });
    }

    const rows = await Fine.getDistrictCollectionSummary({ startDate, endDate });

    return res.status(200).json({
      filters: {
        startDate: startDate || null,
        endDate: endDate || null
      },
      rows
    });
  } catch (error) {
    return next(error);
  }
}

async function getCategoryCollections(req, res, next) {
  try {
    const startDate = normalizeDateInput(req.query.startDate);
    const endDate = normalizeDateInput(req.query.endDate);

    if ((req.query.startDate && !startDate) || (req.query.endDate && !endDate)) {
      return res.status(400).json({ message: "Invalid startDate or endDate format" });
    }

    const rows = await Fine.getCategoryCollectionSummary({ startDate, endDate });

    return res.status(200).json({
      filters: {
        startDate: startDate || null,
        endDate: endDate || null
      },
      rows
    });
  } catch (error) {
    return next(error);
  }
}

async function listOfficerRegistry(req, res, next) {
  try {
    if (!ensureAdminAccess(req, res)) {
      return;
    }

    const registry = await Officer.listOfficerRegistry();
    return res.status(200).json(registry);
  } catch (error) {
    return next(error);
  }
}

async function getOfficerRegistryEntry(req, res, next) {
  try {
    if (!ensureAdminAccess(req, res)) {
      return;
    }

    const id = req.params.id;
    if (!isPositiveIntegerLike(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const entry = await Officer.findOfficerRegistryById(id);
    if (!entry) {
      return res.status(404).json({ message: "Officer registry entry not found" });
    }

    return res.status(200).json(entry);
  } catch (error) {
    return next(error);
  }
}

async function createOfficerRegistryEntry(req, res, next) {
  try {
    if (!ensureAdminAccess(req, res)) {
      return;
    }

    const { badgeNumber, name, phone, district, active } = req.body;

    if (!isNonEmptyString(badgeNumber) || !isNonEmptyString(name) || !isNonEmptyString(phone) || !isNonEmptyString(district)) {
      return res.status(400).json({ message: "badgeNumber, name, phone, and district are required" });
    }

    const entry = await Officer.createOfficerRegistry({
      badgeNumber,
      name,
      phone,
      district,
      active
    });

    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
}

async function updateOfficerRegistryEntry(req, res, next) {
  try {
    if (!ensureAdminAccess(req, res)) {
      return;
    }

    const id = req.params.id;
    if (!isPositiveIntegerLike(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const { badgeNumber, name, phone, district, active } = req.body;

    const entry = await Officer.updateOfficerRegistry(id, {
      badgeNumber,
      name,
      phone,
      district,
      active
    });

    return res.status(200).json(entry);
  } catch (error) {
    return next(error);
  }
}

async function deleteOfficerRegistryEntry(req, res, next) {
  try {
    if (!ensureAdminAccess(req, res)) {
      return;
    }

    const id = req.params.id;
    if (!isPositiveIntegerLike(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await Officer.deleteOfficerRegistry(id);
    return res.status(200).json({ message: "Officer registry entry deleted successfully" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
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
  getCategoryCollections,
  listOfficerRegistry,
  getOfficerRegistryEntry,
  createOfficerRegistryEntry,
  updateOfficerRegistryEntry,
  deleteOfficerRegistryEntry
};