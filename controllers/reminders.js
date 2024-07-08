const express = require("express");
const Reminder = require("../models/reminderbot");
const remindersroute = express.Router();
const config = require("../utils/config");
const logger = require("../utils/logger");
const middleware = require("../utils/middleware");
const secret = config.SECRET;
const {
  signupSchema,
  loginSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  dateSchema,
  verifyOTPSchema,
  timeSchema,
  personalInfoSchema,
  newPasswordSchema,
  setupPasswdSchema,
  changeemailSchema,
  changeemailVerifySchema,
} = require("../models/validationschema");
const validate = require("../utils/validate");
const makeReminder = require("../models/reminderbot");

const {
  addReminder,
  scheduleAllReminders,
  deleteReminders,
  deleteReminder,
} = require("./reminderbot");

const updateReminderTimes = async (reminderId, newTime) => {
  try {
    const reminders = await Reminder.findone({ reminderId }); // Fetch all reminders

    reminders.forEach(async (reminder) => {
      reminder.time = newTime; // Update the time field
      await reminder.save(); // Save the updated reminder
    });

    console.log("All reminders have been updated.");
  } catch (err) {
    console.error("Error updating reminders:", err);
  }
};

// getting all reminders
remindersroute.get("/", async (req, res) => {
  const userId = req.body;
  try {
    const reminders = await Reminder.find({ userId });
    return res.status(200).json({
      status: "success",
      message: "Reminders successfully retrieved",
      data: reminders,
    });
  } catch (err) {
    console.error("Error getting reminders", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

//add new reminder
remindersroute.post("/addnew", async (req, res) => {
  const { userId, time } = req.body;
  try {
    addReminder(userId, time);
  } catch (err) {
    console.error("Error creating reminder", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

//update reminder
remindersroute.patch("/update", async (req, res) => {
  const { reminderId, newTime } = req.body;
  try {
    updateReminderTimes(reminderId, newTime);
  } catch (err) {
    console.error("Error updating reminder", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

//delete a reminder
remindersroute.delete("/delete/:id", async (req, res) => {
  const reminderId = req.params;
  try {
    deleteReminder(reminderId);
  } catch (err) {
    console.error("Error deleting reminders", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

//delete all
remindersroute.delete("/deleteall", async (req, res) => {
  const userId = req.body;
  try {
    deleteReminders(userId);
  } catch (err) {
    console.error("Error deleting reminders", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

module.exports = remindersroute;
