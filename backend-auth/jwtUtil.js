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

  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long");
  }

  return secret;
}

function getJwtExpiresIn() {
  const expiresIn = trimString(process.env.JWT_EXPIRES_IN);
  return expiresIn || "8h";
}

function getJwtOptions() {
  const alg = trimString(process.env.JWT_ALGORITHM) || "HS256";
  const issuer = trimString(process.env.JWT_ISSUER) || null;
  const audience = trimString(process.env.JWT_AUDIENCE) || null;

  const signOptions = { algorithm: alg };
  if (issuer) signOptions.issuer = issuer;
  if (audience) signOptions.audience = audience;

  const verifyOptions = { algorithms: [alg] };
  if (issuer) verifyOptions.issuer = issuer;
  if (audience) verifyOptions.audience = audience;

  return { signOptions, verifyOptions };
}

function generateToken(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createValidationError("Token payload must be an object");
  }

  const secret = getJwtSecret();
  const { signOptions } = getJwtOptions();

  // include expiresIn separately to avoid overriding algorithm
  return jwt.sign(payload, secret, Object.assign({}, signOptions, { expiresIn: getJwtExpiresIn() }));
}

function verifyToken(token) {
  if (typeof token !== "string" || !trimString(token)) {
    throw createValidationError("Token is required");
  }

  const secret = getJwtSecret();
  const { verifyOptions } = getJwtOptions();

  return jwt.verify(token, secret, verifyOptions);
}

module.exports = {
  generateToken,
  verifyToken,
  getJwtSecret,
  getJwtExpiresIn
};
