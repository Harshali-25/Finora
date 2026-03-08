require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// --- YAHOO FINANCE INITIALIZATION ---
// We import the class and create an instance to manage cookies/crumbs correctly
const YahooFinance = require('yahoo-finance2').default; 
const yf = new YahooFinance(); 

// Import Middleware & Services
const { verifyToken } = require("./middleware/authMiddleware");
const startAlertWorker = require("./services/alertWorker");

// Models
const { HoldingsModel } = require('./model/HoldingsModel');
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require('./model/OrdersModel');
const AlertModel = require("./model/AlertModel"); 
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

// --- HELPER: LIVE PRICE FETCHER ---
const getLivePrice = async (symbol) => {
  try {
    const ticker = symbol.endsWith('.NS') ? symbol : `${symbol}.NS`;
    
    // We use the 'yf' instance with browser headers and validation turned off
    // This prevents "Unauthorized" errors and schema crashes.
    const result = await yf.quote(
      ticker, 
      {}, 
      { 
        validateResult: false, // Don't crash if Yahoo data structure changes
        fetchOptions: { 
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' 
          } 
        } 
      }
    );
    
    return result && result.regularMarketPrice ? result.regularMarketPrice : null;
  } catch (error) {
    console.error(`Yahoo Finance Error for ${symbol}:`, error.message);
    return null;
  }
};

// --- API ROUTES ---

// 1. WATCHLIST MARKET DATA
app.post("/api/marketData", verifyToken, async (req, res) => {
  try {
    const { symbols } = req.body; 
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ message: "Invalid symbols array" });
    }

    const marketData = await Promise.all(symbols.map(async (symbol) => {
      const price = await getLivePrice(symbol);
      return { name: symbol, price };
    }));

    res.json(marketData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch market data" });
  }
});

// 2. ALERT ROUTES
app.post("/newAlert", verifyToken, async (req, res) => {
  try {
    const { name, targetPrice, qty, product } = req.body;
    const newAlert = new AlertModel({
      user: req.user.id, 
      name,
      targetPrice: Number(targetPrice),
      qty: Number(qty),
      product: product || "CNC",
      status: "ACTIVE"
    });
    await newAlert.save();
    res.status(201).json({ message: "Alert set successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to set alert" });
  }
});

app.get("/allAlerts", verifyToken, async (req, res) => {
  try {
    const userAlerts = await AlertModel.find({ user: req.user.id });
    res.json(userAlerts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

app.delete("/cancelAlert/:id", verifyToken, async (req, res) => {
  try {
    await AlertModel.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Alert cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel alert" });
  }
});

// 3. BUY/SELL ENGINE
// backend/index.js - Update your newOrder route
app.post("/newOrder", verifyToken, async (req, res) => {
  try {
    const { name, qty, price, mode, product } = req.body;
    const userId = req.user.id;
    const numQty = Number(qty);
    const numPrice = Number(price);

    // 1. Determine which collection to update
    const TargetModel = (product === "MIS") ? PositionsModel : HoldingsModel;

    // 2. SELL VALIDATION: Only allow selling what the user actually owns
    if (mode === "SELL") {
      const existingAsset = await TargetModel.findOne({ name, user: userId });

      if (!existingAsset || existingAsset.qty < numQty) {
        return res.status(400).json({ 
          message: `Insufficient quantity. You only have ${existingAsset ? existingAsset.qty : 0} shares of ${name}.` 
        });
      }
    }

    // 3. LOG THE ORDER (Appears in your Orders tab)
    const newOrder = new OrdersModel({
      user: userId,
      name,
      qty: numQty,
      price: numPrice,
      mode,
      product: product || "CNC",
      status: "COMPLETE"
    });
    await newOrder.save();

    // 4. UPDATE INVENTORY (Holdings/Positions)
    if (mode === "BUY") {
      // If the stock exists, increase qty and update avg price. If not, create it.
      await TargetModel.findOneAndUpdate(
        { name, user: userId },
        { 
          $inc: { qty: numQty }, 
          $set: { avg: numPrice, price: numPrice } 
        },
        { upsert: true, new: true }
      );
    } else if (mode === "SELL") {
      const asset = await TargetModel.findOne({ name, user: userId });
      asset.qty -= numQty;
      
      // If quantity becomes zero, remove the ticker from holdings
      if (asset.qty <= 0) {
        await asset.deleteOne();
      } else {
        await asset.save();
      }
    }

    res.status(201).json({ message: "Order processed successfully" });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 4. LIVE DATA FETCHING
app.get('/allHoldings', verifyToken, async (req, res) => {
  try {
    const userHoldings = await HoldingsModel.find({ user: req.user.id });
    const liveHoldings = await Promise.all(userHoldings.map(async (hold) => {
      const currentPrice = await getLivePrice(hold.name);
      const updatedHold = hold.toObject(); 
      updatedHold.price = currentPrice || hold.price; 
      return updatedHold;
    }));
    res.json(liveHoldings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holdings" });
  }
});

app.get("/allPositions", verifyToken, async (req, res) => {
  try {
    const userPositions = await PositionsModel.find({ user: req.user.id });
    const livePositions = await Promise.all(userPositions.map(async (pos) => {
      const currentPrice = await getLivePrice(pos.name);
      const updatedPos = pos.toObject();
      updatedPos.price = currentPrice || pos.price;
      return updatedPos;
    }));
    res.status(200).json(livePositions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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

// Auth & Admin Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// --- STARTUP ---
mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    startAlertWorker(); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("DB connection failed:", error.message));