const bcrypt = require("bcryptjs");
const Officer = require("./Officer");

function trimString(value) {
  return String(value || "").trim();
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasAdminSeedConfig() {
  return Boolean(
    process.env.SEED_ADMIN_BADGE_NUMBER ||
      process.env.SEED_ADMIN_NAME ||
      process.env.SEED_ADMIN_PHONE ||
      process.env.SEED_ADMIN_DISTRICT ||
      process.env.SEED_ADMIN_PASSWORD
  );
}

async function seedInitialAdmin() {
  if (!hasAdminSeedConfig()) {
    return;
  }

  const {
    SEED_ADMIN_BADGE_NUMBER,
    SEED_ADMIN_NAME,
    SEED_ADMIN_PHONE,
    SEED_ADMIN_DISTRICT,
    SEED_ADMIN_PASSWORD
  } = process.env;

  if (!SEED_ADMIN_BADGE_NUMBER || !SEED_ADMIN_NAME || !SEED_ADMIN_PHONE || !SEED_ADMIN_DISTRICT || !SEED_ADMIN_PASSWORD) {
    throw new Error("All SEED_ADMIN_* variables must be set together");
  }

  const badgeNumber = trimString(SEED_ADMIN_BADGE_NUMBER);
  const name = trimString(SEED_ADMIN_NAME);
  const phone = trimString(SEED_ADMIN_PHONE);
  const district = trimString(SEED_ADMIN_DISTRICT);
  const password = trimString(SEED_ADMIN_PASSWORD);

  if (!isNonEmptyString(badgeNumber) || !isNonEmptyString(name) || !isNonEmptyString(phone) || !isNonEmptyString(district) || !isNonEmptyString(password)) {
    throw new Error("SEED_ADMIN_* variables must not be blank");
  }

  const existing = await Officer.findOfficerByBadgeNumber(badgeNumber);

  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await Officer.createOfficer({
    badgeNumber,
    name,
    phone,
    district,
    passwordHash,
    role: "admin"
  });

  console.log(`Seeded initial admin officer ${badgeNumber}`);
}

module.exports = {
  seedInitialAdmin
};