const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "User profile fetched successfully",
    user: req.user,
  });
});
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const [holdings, positions, orders] = await Promise.all([
      HoldingsModel.countDocuments({}),
      PositionsModel.countDocuments({}),
      OrdersModel.countDocuments({}),
    ]);

    res.json({
      message: "Dashboard data fetched successfully",
      stats: {
        holdings,
        positions,
        orders,
      },
    });
  } catch (error) {
    console.error("USER DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
