const { Schema } = require("mongoose");

const HoldingsSchema = new Schema({
  name: String, // Stock symbol
  qty: Number, // Quantity owned
  avg: Number, // Average purchase price
  price: Number, // Current market price
  net: String, // Net P&L as a string (e.g., "+5.2%")
  day: String, // Day's change percentage
});

module.exports = { HoldingsSchema };