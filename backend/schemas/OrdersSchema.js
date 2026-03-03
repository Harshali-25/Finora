const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  name: String, // Stock symbol
  qty: Number, // Quantity
  price: Number, // Price at which order was placed
  mode: String, // "BUY" or "SELL"
});

module.exports = { OrdersSchema };