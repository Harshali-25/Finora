const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { HoldingsModel } = require("../model/HoldingsModel");
const { OrdersModel } = require("../model/OrdersModel");
const { PositionsModel } = require("../model/PositionsModel");

const router = express.Router();

router.get("/orders", verifyToken, async (req, res) => {
  const orders = await OrdersModel.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/holdings", verifyToken, async (req, res) => {
  const holdings = await HoldingsModel.find({ user: req.user.id });
  res.json(holdings);
});

router.get("/positions", verifyToken, async (req, res) => {
  const positions = await PositionsModel.find({ user: req.user.id });
  res.json(positions);
});

router.post("/trade", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, qty, price, mode, product } = req.body;

    // 1. Log the Order
    await OrdersModel.create({
      user: userId, name, qty, price, mode, product,
      time: new Date()
    });

    // 2. Update Positions (Appears in Positions tab)
    let pos = await PositionsModel.findOne({ user: userId, name });
    const qtyChange = mode === "BUY" ? qty : -qty;
    if (pos) {
      pos.qty += qtyChange;
      await pos.save();
    } else {
      await PositionsModel.create({ user: userId, name, qty: qtyChange, avg: price });
    }

    // 3. Update Holdings (Only if CNC)
    if (product === "CNC") {
      let hold = await HoldingsModel.findOne({ user: userId, name });
      if (mode === "BUY") {
        if (hold) {
          hold.qty += qty;
          await hold.save();
        } else {
          await HoldingsModel.create({ user: userId, name, qty, avg: price });
        }
      } else {
        if (!hold || hold.qty < qty) return res.status(400).json({ message: "Insufficient holdings" });
        hold.qty -= qty;
        hold.qty === 0 ? await hold.deleteOne() : await hold.save();
      }
    }
    res.status(200).json({ message: "Trade Success!" });
  } catch (err) {
    res.status(500).json({ message: "Trade Failed" });
  }
});

module.exports = router;