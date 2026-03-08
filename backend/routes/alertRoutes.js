const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { AlertsSchema } = require("../schemas/AlertSchema");
// Assuming you have an authentication middleware
const { userAuth } = require("../middleware/authMiddleware"); 

const Alert = mongoose.model("Alert", AlertsSchema);

// POST: Create a new alert
// Removed "/api/user" from the string if you mount this in server.js with that prefix
router.post("/alerts", userAuth, async (req, res) => {
  try {
    const { name, targetPrice, qty, product } = req.body;
    
    const newAlert = new Alert({
      userId: req.user.id, // Populated by userAuth middleware
      name,
      targetPrice,
      qty,
      product,
      status: "ACTIVE"
    });

    await newAlert.save();
    res.status(201).json({ message: "Alert set successfully", alert: newAlert });
  } catch (err) {
    res.status(500).json({ message: "Error saving alert", error: err.message });
  }
});

// GET: Fetch all active alerts for the logged-in user
router.get("/alerts", userAuth, async (req, res) => {
  try {
    const userAlerts = await Alert.find({ userId: req.user.id });
    res.status(200).json(userAlerts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching alerts", error: err.message });
  }
});

// DELETE: Cancel an alert
// DELETE an alert by ID
app.delete("/deleteAlert/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.findByIdAndDelete(id);
    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting alert", error: err });
  }
});

module.exports = router;