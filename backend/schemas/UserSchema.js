const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    // Wallet balance for buying stocks
    balance: {
      type: Number,
      default: 100000, // Initial virtual money for the platform
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    otp: String,
    otpExpiry: Date,
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals show up in JSON responses
    toObject: { virtuals: true }
  }
);

// Virtual relationship: Link to Holdings
UserSchema.virtual("holdings", {
  ref: "Holdings",      // The model name in HoldingsModel.js
  localField: "_id",
  foreignField: "user", // The field name we added to HoldingsSchema
});

// Virtual relationship: Link to Orders
UserSchema.virtual("orders", {
  ref: "Orders",        // The model name in OrdersModel.js
  localField: "_id",
  foreignField: "user",
});

module.exports = UserSchema;