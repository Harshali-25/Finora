require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Middleware & Services
const { verifyToken } = require("./middleware/authMiddleware");
const startAlertWorker = require("./services/alertWorker"); // New service

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Models
const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');
const AlertModel = require("./model/AlertModel"); // Import the new Alert Model
const User = require("./model/UserModel");

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); 

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// --- FEATURE 7: ALERT ROUTES ---
app.post("/newAlert", verifyToken, async (req, res) => {
  try {
    const { name, targetPrice, condition } = req.body;
    const newAlert = new AlertModel({
      user: req.user.id,
      name,
      targetPrice: Number(targetPrice),
      condition,
    });
    await newAlert.save();
    res.status(201).json({ message: "Alert set successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to set alert" });
  }
});

// --- FEATURE 3: SECURE BUY/SELL ENGINE ---
app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode, product } = req.body; 
    const userId = req.user.id;

    const numQty = Number(qty);
    const numPrice = Number(price);

    const newOrder = new OrdersModel({
      user: userId,
      name,
      qty: numQty,
      price: numPrice,
      mode,
    });
    await newOrder.save();

    if (mode === "BUY") {
      if (product === "MIS") {
        const existingPos = await PositionsModel.findOne({ name, user: userId });
        if (existingPos) {
          existingPos.qty += numQty;
          await existingPos.save();
        } else {
          await PositionsModel.create({ name, qty: numQty, avg: numPrice, price: numPrice, product: "MIS", user: userId });
        }
      } else {
        const existingHold = await HoldingsModel.findOne({ name, user: userId });
        if (existingHold) {
          const oldTotalValue = existingHold.avg * existingHold.qty;
          const newTotalValue = numPrice * numQty;
          existingHold.qty += numQty;
          existingHold.avg = (oldTotalValue + newTotalValue) / existingHold.qty;
          await existingHold.save();
        } else {
          await HoldingsModel.create({ name, qty: numQty, avg: numPrice, price: numPrice, user: userId });
        }
      }
    } 
    else if (mode === "SELL") {
      const model = (product === "MIS") ? PositionsModel : HoldingsModel;
      const existingAsset = await model.findOne({ name, user: userId });

      if (!existingAsset || existingAsset.qty < numQty) {
        return res.status(400).json({ message: "Insufficient quantity to sell" });
      }

      existingAsset.qty -= numQty;
      if (existingAsset.qty === 0) {
        await existingAsset.deleteOne();
      } else {
        await existingAsset.save();
      }
    }

    res.status(201).json({ message: "Order processed successfully" });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- FEATURE 4: PERSONALIZED DATA FETCHING ---
app.get('/allHoldings', verifyToken, async (req, res) => {
  try {
    const userHoldings = await HoldingsModel.find({ user: req.user.id });
    res.json(userHoldings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", verifyToken, async (req, res) => {
  try {
    const userPositions = await PositionsModel.find({ user: req.user.id });
    res.json(userPositions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch positions" });
  }
});

app.get("/allOrders", verifyToken, async (req, res) => {
  try {
    const userOrders = await OrdersModel.find({ user: req.user.id });
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Database Connection
mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Initialize the Price Alert Worker
    startAlertWorker(); 
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("DB connection failed:", error.message));