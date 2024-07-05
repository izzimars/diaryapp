const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const Reminder = require("../models/reminderbot");
const logger = require("./utils/logger");

const sendEmail = (userEmail, reminderText) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: userEmail,
    subject: "Daily Reminder",
    text: reminderText,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error: ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

const scheduleReminder = (reminder) => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = reminder.hour;
  rule.minute = reminder.minute;

  schedule.scheduleJob(rule, () => {
    sendEmail(
      reminder.user.email,
      `Hello ${reminder.user.username}, it is time for a new dairy entry in your personal dove diary. \n 
        Make your new entries here and view them on your dashboard later.`
    );
  });
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
      console.error("Error saving reminder:", err);
    } else {
      console.log("Reminder saved:", newReminder);
      scheduleReminder(newReminder); // Schedule the new reminder
    }
  });
};

module.exports = { addReminder, scheduleAllReminders };
