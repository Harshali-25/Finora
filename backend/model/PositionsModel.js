const { model, Schema } = require("mongoose");

const PositionsSchema = new Schema({
  product: String, // "MIS" (Intraday) or "CNC" (Delivery)
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String, // Net P&L as a string
  day: String,
  isLoss: Boolean,
});

module.exports = { PositionsModel: model("position", PositionsSchema) };