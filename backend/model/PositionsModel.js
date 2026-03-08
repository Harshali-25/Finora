const { model, Schema } = require("mongoose");

const PositionsSchema = new Schema({
  // IMPORTANT: This links the position to the logged-in user
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  product: String, 
  name: String,
  qty: Number,
  avg: Number,
  price: Number,
  net: String,
  day: String,
  isLoss: Boolean,
});

// Change the export to be a direct model export
const PositionsModel = model("position", PositionsSchema);
module.exports = { PositionsModel }; // Export as an object to match index.js