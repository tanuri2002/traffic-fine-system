const bcrypt = require("bcryptjs");
const Officer = require("./Officer");

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

  const badgeNumber = SEED_ADMIN_BADGE_NUMBER.trim();
  const existing = await Officer.findOfficerByBadgeNumber(badgeNumber);

  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);

  await Officer.createOfficer({
    badgeNumber,
    name: SEED_ADMIN_NAME.trim(),
    phone: SEED_ADMIN_PHONE.trim(),
    district: SEED_ADMIN_DISTRICT.trim(),
    passwordHash,
    role: "admin"
  });

  console.log(`Seeded initial admin officer ${badgeNumber}`);
}

module.exports = {
  seedInitialAdmin
};