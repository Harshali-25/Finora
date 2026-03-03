const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  product: String, // "MIS" (Intraday) or "CNC" (Delivery)
  name: String, // Stock symbol
  qty: Number, // Quantity
  avg: Number, // Average purchase price
  price: Number, // Current market price
  net: String, // Net P&L
  day: String, // Day's change
  isLoss: Boolean, // Helper for UI color-coding
});

module.exports = { PositionsSchema };