const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");
const User = require("../model/UserModel");

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, async (req, res) => {
  try {
    const [users, verifiedUsers, holdings, positions, orders] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isVerified: true }),
      HoldingsModel.countDocuments({}),
      PositionsModel.countDocuments({}),
      OrdersModel.countDocuments({}),
    ]);

    res.json({
      message: "Welcome Admin",
      stats: {
        users,
        verifiedUsers,
        holdings,
        positions,
        orders,
      },
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

module.exports = router;