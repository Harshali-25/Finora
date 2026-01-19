const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "User profile fetched successfully",
    user: req.user,
  });
});

module.exports = router;
