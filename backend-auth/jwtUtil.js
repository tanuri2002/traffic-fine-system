const jwt = require("jsonwebtoken");

function trimString(value) {
  return String(value || "").trim();
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function getJwtSecret() {
  const secret = trimString(process.env.JWT_SECRET);

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return secret;
}

function getJwtExpiresIn() {
  const expiresIn = trimString(process.env.JWT_EXPIRES_IN);
  return expiresIn || "8h";
}

function generateToken(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createValidationError("Token payload must be an object");
  }

  const secret = getJwtSecret();

  return jwt.sign(payload, secret, {
    expiresIn: getJwtExpiresIn()
  });
}

function verifyToken(token) {
  if (typeof token !== "string" || !trimString(token)) {
    throw createValidationError("Token is required");
  }

  const secret = getJwtSecret();
  return jwt.verify(token, secret);
}

module.exports = {
  generateToken,
  verifyToken
};
