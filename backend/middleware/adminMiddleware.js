exports.isAdmin = (req, res, next) => {
  // authMiddleware must run before this to set req.user
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No user data" });
  }

  // Check if the role extracted from the token is ADMIN
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};