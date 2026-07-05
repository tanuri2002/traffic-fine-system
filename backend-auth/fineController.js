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

async function registerOfficer(req, res, next) {
  try {
    const { badgeNumber, name, phone, district, password } = req.body;

    if (!badgeNumber || !name || !phone || !district || !password) {
      return res.status(400).json({ message: "badgeNumber, name, phone, district, and password are required" });
    }

    const normalizedBadgeNumber = badgeNumber.trim();
    const existing = await Officer.findOfficerByBadgeNumber(normalizedBadgeNumber);
    if (existing) {
      return res.status(409).json({ message: "Officer already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const officer = await Officer.createOfficer({
      badgeNumber: normalizedBadgeNumber,
      name: name.trim(),
      phone: phone.trim(),
      district: district.trim(),
      passwordHash,
      role: "officer"
    });

    return res.status(201).json({
      id: officer.id,
      badgeNumber: officer.badgeNumber,
      role: officer.role
    });
  } catch (error) {
    return next(error);
  }
}

async function loginOfficer(req, res, next) {
  try {
    const { badgeNumber, password } = req.body;

    if (!badgeNumber || !password) {
      return res.status(400).json({ message: "badgeNumber and password are required" });
    }

    const officer = await Officer.findOfficerByBadgeNumber(badgeNumber.trim());
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
        district: officer.district,
        role: officer.role
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { code, title, amountLkr, description } = req.body;

    if (!code || !title || amountLkr === undefined) {
      return res.status(400).json({ message: "code, title, amountLkr are required" });
    }

    const normalizedCode = normalizeCode(code);
    const existing = await Category.findCategoryByCode(normalizedCode);
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await Category.createCategory({
      code: normalizedCode,
      title: title.trim(),
      amountLkr: Number(amountLkr),
      description: (description || "").trim()
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
    const { referenceNumber, categoryCode, driverLicenseNo, vehicleNo } = req.body;

    if (!referenceNumber || !categoryCode || !driverLicenseNo || !vehicleNo) {
      return res.status(400).json({
        message: "referenceNumber, categoryCode, driverLicenseNo, vehicleNo are required"
      });
    }

    const normalizedReference = normalizeRef(referenceNumber);
    const normalizedCategoryCode = normalizeCode(categoryCode);

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
      driverLicenseNo: normalizeCode(driverLicenseNo),
      vehicleNo: normalizeCode(vehicleNo)
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

    if (!referenceNumber || (!categoryCode && !categoryId)) {
      return res.status(400).json({ message: "referenceNumber and either categoryCode or categoryId are required" });
    }

    const fine = await Fine.findFineByReferenceWithDetails(normalizeRef(referenceNumber));

    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    if (categoryCode && fine.category.code !== normalizeCode(categoryCode)) {
      return res.status(404).json({ message: "Fine not found for this category" });
    }

    if (categoryId && Number(fine.category.id) !== Number(categoryId)) {
      return res.status(404).json({ message: "Fine not found for this category" });
    }

    return res.status(200).json({
      referenceNumber: fine.referenceNumber,
      status: fine.status,
      category: fine.category,
      amountLkr: fine.category.amountLkr,
      officer: fine.officer,
      issuedAt: fine.createdAt,
      paidAt: fine.paidAt
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
    const referenceNumber = normalizeRef(req.params.referenceNumber);
    const { channel } = req.body;

    const fine = await Fine.findFineByReference(referenceNumber);
    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    if (fine.status === "PAID") {
      return res.status(200).json({ message: "Fine already paid", fine });
    }

    const paymentChannel = ["MOBILE", "WEB"].includes(channel) ? channel : "WEB";

    const updatedFine = await Fine.updateFineAsPaid(referenceNumber, paymentChannel);

    return res.status(200).json({ message: "Fine marked as paid", fine: updatedFine });
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
  markFineAsPaid
};
