const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const Reminder = require("../models/reminderbot");
const logger = require("../utils/logger");
const logger = require("../utils/config");
const { config } = require("dotenv");
const User = require("../models/user");

const sendEmail = (userEmail, reminderText) => {
  const mailOptions = {
    from: config.EMAIL_USER,
    to: userEmail,
    subject: "Daily Reminder",
    text: reminderText,
  };

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`Error: ${error}`);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
  });
};

const scheduleReminder = async (reminder) => {
  try {
    const rule = new schedule.RecurrenceRule();
    rule.hour = reminder.hour;
    rule.minute = reminder.minute;
    const user = await User.findById({ _id: reminder.user });

    schedule.scheduleJob(rule, () => {
      logger.info(`reminder scheduled for ${user._id}`);
      sendEmail(
        user.email,
        `Hello ${user.username}, it is time for a new dairy entry in your personal dove diary. \n 
        Make your new entries here and view them on your dashboard later.`
      );
    });
  } catch (error) {
    logger.error(`Error scheduling reminder: ${error}`);
  }
};

// Function to fetch reminders from database and schedule them
const scheduleAllReminders = () => {
  Reminder.find({}, (err, reminders) => {
    if (err) {
      logger.error("Error fetching reminders:", err);
    } else {
      reminders.forEach((reminder) => {
        scheduleReminder(reminder);
      });
      logger.info("All reminders scheduled.");
    }
  });
};

// Example of adding a new reminder to the database
const addReminder = (user, time) => {
  let hour;
  const divTime = time.split(/[: ]/);
  if (divTime[2] == "am") {
    hour = divTime[0];
  } else {
    hour = Number(divTime[0]) + 12 < 24 ? divTime[0] * 2 : 0;
  }
  const mins = Number(divTime[1]);
  const newReminder = new Reminder({ user, hour, mins });
  newReminder.save((err) => {
    if (err) {
      logger.error("Error saving reminder:", err);
    } else {
      logger.info("Reminder saved:", newReminder);
      scheduleReminder(newReminder); // Schedule the new reminder
    }
  });
};

module.exports = { addReminder, scheduleAllReminders };
