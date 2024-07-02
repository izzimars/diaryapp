const express = require("express");
const jwt = require("jsonwebtoken");
const Diary = require("../models/diary");
const User = require("../models/user");
const diaryrouter = express.Router();
const secret = process.env.SECRET;

// Middleware to check JWT
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: err.message,
        error: "Failed to authenticate token",
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Add Diary Entry
diaryrouter.post("/", authenticate, async (req, res) => {
  const { content } = req.body;
  try {
    const diary = new Diary({ userId: req.userId, content });
    await diary.save();
    return res.status(201).json({
      status: "success",
      message: "Diary succesfully saved",
      data: diary,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

// Get All Diary Entries
diaryrouter.get("/", authenticate, async (req, res) => {
  try {
    const diaries = await Diary.find({ userId: req.userId }).sort({ date: -1 });
    return res.status(200).json({
      status: "success",
      message: "Diaries succesfully retrieved",
      data: diaries,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

// Filter Diary Entries by Date Range
diaryrouter.get("/filter", authenticate, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const diaries = await Diary.find({
      userId: req.userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: -1 });
    return res.status(200).json({
      status: "success",
      message: "Diaries succesfully retrieved",
      data: diaries,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

module.exports = diaryrouter;
