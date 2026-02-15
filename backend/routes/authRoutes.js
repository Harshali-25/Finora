const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/UserModel");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ================= DATABASE CHECK ================= */
const ensureDatabaseConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: "Database is not connected. Check MongoDB Atlas connection.",
    });
    return false;
  }
  return true;
};

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    if (!ensureDatabaseConnected(res)) return;

    const { name, email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Regenerate OTP for unverified user
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      existingUser.name = name;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.otp = otp;
      existingUser.otpExpiry = Date.now() + 10 * 60 * 1000;
      await existingUser.save();

      const otpSent = await sendEmail(normalizedEmail, otp);

      return res.status(200).json({
        message: "Account exists but not verified. New OTP sent.",
        userId: existingUser._id,
        otpDelivery: otpSent ? "email" : "console",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    const otpSent = await sendEmail(normalizedEmail, otp);

    return res.status(201).json({
      message: "Registered successfully. OTP sent.",
      userId: user._id,
      otpDelivery: otpSent ? "email" : "console",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    if (!ensureDatabaseConnected(res)) return;

    const { email, otp } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (!user.otpExpiry || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.json({
      message: "OTP verified successfully. You can now login.",
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
});

/* ================= RESEND OTP ================= */
router.post("/resend-otp", async (req, res) => {
  try {
    if (!ensureDatabaseConnected(res)) return;

    const { email } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail)
      return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: normalizedEmail });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const otpSent = await sendEmail(normalizedEmail, otp);

    return res.json({
      message: "OTP resent successfully",
      otpDelivery: otpSent ? "email" : "console",
    });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    if (!ensureDatabaseConnected(res)) return;

    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !password)
      return res.status(400).json({ message: "Email and password required" });

    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "JWT secret not configured" });

    const user = await User.findOne({ email: normalizedEmail });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify OTP first" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectTo: user.role === "ADMIN"
        ? "/admin/dashboard"
        : "/dashboard",
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
