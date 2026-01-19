const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isVerified: { type: Boolean, default: false },

    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

module.exports = UserSchema;
