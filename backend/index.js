require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Models
const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');

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

// --- ORDER LOGIC (STAMPED WITH UID) ---
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode, product, uid } = req.body; 

    if (!uid) return res.status(400).send("User ID is missing");

    // Save to order history
    let newOrder = new OrdersModel({
      name,
      qty: Number(qty),
      price: Number(price),
      mode,
      uid // Ownership stamp for data isolation
    });
    await newOrder.save();

    // Update Positions (Intraday - MIS) or Holdings (Delivery - CNC)
    if (product === "MIS") {
      const existingPos = await PositionsModel.findOne({ name, uid });
      if (mode === "BUY") {
        if (existingPos) {
          existingPos.qty += Number(qty);
          await existingPos.save();
        } else {
          await PositionsModel.create({ name, qty: Number(qty), avg: price, price, product: "MIS", uid });
        }
      }
      // Note: SELL logic for MIS needs to be implemented based on requirements
    } else {
      const existingHold = await HoldingsModel.findOne({ name, uid });
      if (mode === "BUY") {
        if (existingHold) {
          const oldTotal = existingHold.avg * existingHold.qty;
          const newTotal = price * Number(qty);
          existingHold.qty += Number(qty);
          existingHold.avg = (oldTotal + newTotal) / existingHold.qty;
          await existingHold.save();
        } else {
          await HoldingsModel.create({ name, qty: Number(qty), avg: price, price, uid });
        }
      }
      // Note: SELL logic for CNC needs to be implemented based on requirements
    }
    res.status(201).send("Success");
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).send(err.message);
  }
});

// --- FILTERED DATA FETCHING ---
app.get('/allHoldings', async (req, res) => {
  try {
    const { uid } = req.query; 
    if (!uid) return res.status(400).json({ message: "UID missing" });
    const userHoldings = await HoldingsModel.find({ uid }); // Private data only
    res.json(userHoldings);
  } catch (error) {
    console.error("HOLDINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ message: "UID missing" });
    const userPositions = await PositionsModel.find({ uid }); // Private data only
    res.json(userPositions);
  } catch (error) {
    console.error("POSITIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch positions" });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ message: "UID missing" });
    let userOrders = await OrdersModel.find({ uid }); // Private history only
    res.json(userOrders);
  } catch (err) {
    console.error("ORDERS ERROR:", err);
    res.status(500).send(err);
  }
});

// Database Connection
mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("DB connection failed:", error.message));