const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const userrouter = express.Router();
const secret = process.env.SECRET;

// Register User
userrouter.post("/register", async (req, res) => {
  //more input to be added
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    const flag = await user.save();

    // Send verification email
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "your_email@gmail.com", pass: "your_email_password" },
    });
    const mailOptions = {
      from: "your_email@gmail.com",
      to: user.email,
      subject: "Verify Your Email",
      text: `Click this link to verify your email: http://localhost:3000/api/users/verify/${token}`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: "success",
      message: "User registered, verification email sent",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

// Verify Email
userrouter.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    user.verified = true;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
});

// Login User
userrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
    if (!user.verified) {
      return res.status(400).json({
        status: "error",
        message: "Email not verified",
      });
    }
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    return res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

module.exports = userrouter;