const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/UserModel");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  console.log("========== REGISTER START ==========");

  try {
    console.log("Request Body:", req.body);

    if (mongoose.connection.readyState !== 1) {
      console.log("DB not connected");
      return res.status(503).json({ message: "Database connection error" });
    }

    const { name, email, password, role } = req.body;

    console.log("Finding user...");

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    console.log("User Found:", !!user);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = Date.now() + 10 * 60 * 1000;

    console.log("Hashing password...");

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Password Hashed");

    if (user) {
      console.log("Updating user");

      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await user.save();

      console.log("User Updated");
    } else {
      console.log("Creating user");

      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false,
        role: role || "USER",
      });

      console.log("User Created");
    }

    console.log("Sending Email...");

    const otpSent = await sendEmail(
      normalizedEmail,
      "Finora Email Verification",
      `<h2>Your OTP is ${otp}</h2>`
    );

    console.log("Email Sent:", otpSent);

    return res.status(201).json({
      message: "OTP Sent",
      email: normalizedEmail,
    });

  } catch (err) {
    console.error("REGISTER ERROR");
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.otp !== otp.toString().trim() || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null; 
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({ 
      success: true, 
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Invalid credentials or unverified account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
});

/* ================= FORGOT PASSWORD (FEATURE 7) ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = resetOtp;
    user.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    await sendEmail(user.email, `Your Password Reset Code: ${resetOtp}`);

    res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.otp !== otp.toString().trim() || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Reset failed" });
  }
});

module.exports = router;