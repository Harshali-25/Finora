const { Schema } = require("mongoose");

const AlertsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  targetPrice: Number,
  qty: Number,
  product: { type: String, default: "CNC" },
  status: { type: String, default: "ACTIVE" } // ACTIVE or TRIGGERED
}, { timestamps: true });

module.exports = { AlertsSchema };