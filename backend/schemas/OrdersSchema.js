const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: String, 
  qty: Number, 
  price: Number, 
  mode: String, 
  // Explicitly adding time field for easier frontend access
  time: { type: Date, default: Date.now } 
}, { timestamps: true });

module.exports = { OrdersSchema };