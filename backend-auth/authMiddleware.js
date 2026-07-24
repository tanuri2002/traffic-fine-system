const { verifyToken } = require("./jwtUtil");

function extractBearerToken(authHeader) {
  if (typeof authHeader !== "string") {
    return null;
  }

  const [scheme, token, ...extraParts] = authHeader.trim().split(/\s+/);

  if (scheme !== "Bearer" || !token || extraParts.length > 0) {
    return null;
  }

  return token;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = extractBearerToken(authHeader);

  if (!token) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

module.exports = {
  authMiddleware,
  requireRole
};
