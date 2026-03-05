const { Schema, model } = require("mongoose");

const AlertSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // Stock Symbol
  targetPrice: { type: Number, required: true },
  condition: { type: String, enum: ["ABOVE", "BELOW"], default: "ABOVE" },
  isActive: { type: Boolean, default: true },
});

module.exports = model("Alert", AlertSchema);