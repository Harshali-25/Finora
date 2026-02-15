const jwt = require("jsonwebtoken");

function extractBearerToken(authorizationHeader) {
  if (!authorizationHeader) {
    return { ok: false, message: "No token provided" };
  }

  if (typeof authorizationHeader !== "string") {
    return { ok: false, message: "Malformed authorization header" };
  }

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
    const decoded = jwt.verify(extracted.token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
