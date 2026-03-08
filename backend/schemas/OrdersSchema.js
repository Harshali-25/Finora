const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: String, 
  qty: Number, 
  price: Number, 
  mode: String, 
  // ADD THIS: Essential for distinguishing long-term (CNC) from intraday (MIS)
  product: { type: String, required: true }, 
  time: { type: Date, default: Date.now } 
}, { timestamps: true });

module.exports = { OrdersSchema };