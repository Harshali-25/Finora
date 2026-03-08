const { Schema, model } = require("mongoose");

const AlertSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, 
  targetPrice: { type: Number, required: true },
  // Add these fields so they aren't lost when saving
  qty: { type: Number, default: 1 },
  product: { type: String, default: "CNC" },
  status: { type: String, default: "ACTIVE" },
  condition: { type: String, enum: ["ABOVE", "BELOW"], default: "ABOVE" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const AlertModel = model("alert", AlertSchema);

module.exports = AlertModel;