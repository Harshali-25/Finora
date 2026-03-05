const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const User = require("../model/UserModel");
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");

const router = express.Router();

// Fetch dashboard stats - Only accessible by ADMIN
router.get("/dashboard", verifyToken, isAdmin, async (req, res) => {
  try {
    const [usersCount, ordersCount, allHoldings] = await Promise.all([
      User.countDocuments({}),
      OrdersModel.countDocuments({}),
      HoldingsModel.find({}),
    ]);

    // Feature 5: Calculate Overall Created Value
    const totalValue = allHoldings.reduce((acc, curr) => acc + (curr.qty * curr.avg), 0);

    res.json({
      success: true,
      stats: {
        users: usersCount,
        orders: ordersCount,
        totalValue: totalValue.toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin data" });
  }
});

module.exports = router;