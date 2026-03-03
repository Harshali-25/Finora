const jwt = require("jsonwebtoken");

function extractBearerToken(authorizationHeader) {
  if (!authorizationHeader) {
    return { ok: false, message: "No token provided" };
  }

  if (typeof authorizationHeader !== "string") {
    return { ok: false, message: "Malformed authorization header" };
  }

  // Split "Bearer <token>"
  const [scheme, token] = authorizationHeader.trim().split(/\s+/);

  if (scheme !== "Bearer" || !token) {
    return { ok: false, message: "Malformed authorization header" };
  }

  return { ok: true, token };
}

exports.verifyToken = (req, res, next) => {
  const extracted = extractBearerToken(req.headers.authorization);

  if (!extracted.ok) {
    return res.status(401).json({ message: extracted.message });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server authentication is not configured" });
  }

  try {
    // Verify token using secret key
    const decoded = jwt.verify(extracted.token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info (id, role, etc.) to req
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};