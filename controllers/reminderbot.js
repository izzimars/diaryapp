const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const Reminder = require("../models/reminderbot");
const logger = require("../utils/logger");
// const logger = require("../utils/config");
const config = require("../utils/config");
const User = require("../models/user");

const sendEmail = async (userEmail, reminderText) => {
  try {
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
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

const scheduleReminder = async (reminder) => {
  try {
    logger.info("A job is being created for the reminder");
    const rule = new schedule.RecurrenceRule();
    rule.hour = reminder.hour;
    rule.minute = reminder.time;
    const user = await User.findById({ _id: reminder.userId });
    if (!user) {
      throw new Error(`User with ID ${reminder.user} not found`);
    }
    logger.info(
      `User found: ${user._id}, scheduling job for ${rule.hour}:${rule.minute}:${rule.second}`
    );
    schedule.scheduleJob(rule, () => {
      logger.info(`Reminder job running for user ${user._id}`);
      sendEmail(
        user.email,
        `Hello ${user.username}, it is time for a new diary entry in your personal dove diary. \n 
        Make your new entries here and view them on your dashboard later.`
      );
    });
  } catch (error) {
    logger.error(`Error scheduling reminder: ${error}`);
  }
};

// const scheduleReminder = async (reminder) => {
//   try {
//     logger.info("A job is being created for the reminder");
//     const rule = new schedule.RecurrenceRule();
//     rule.hour = reminder.hour;
//     console.log(reminder.hour);
//     console.log(reminder.min);
//     rule.minute = reminder.minute;
//     const user = await User.findById({ _id: reminder.userId });
//     logger.info("A User has been found to create a reminder");

//     schedule.scheduleJob(rule, () => {
//       logger.info(`reminder scheduled for ${user._id}`);
//       sendEmail(
//         user.email,
//         `Hello ${user.username}, it is time for a new dairy entry in your personal dove diary. \n
//         Make your new entries here and view them on your dashboard later.`
//       );
//     });
//   } catch (error) {
//     logger.error(`Error scheduling reminder: ${error}`);
//   }
// };

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
const addReminder = async (user, time) => {
  let hour;
  const divTime = time.split(/[: ]/);
  if (divTime[2] == "am") {
    hour = divTime[0];
  } else {
    let temp_hour = Number(divTime[0]) + 12;
    hour = temp_hour < 24 ? temp_hour : 0;
  }
  const mins = Number(divTime[1]);
  try {
    const newReminder = new Reminder({ userId: user, hour: hour, time: mins });
    await newReminder.save();
    logger.info(`Reminder saved for ${newReminder._id}`);
    await scheduleReminder(newReminder);
    logger.info(`The reminder has been set for ${newReminder._id}`);
    return { status: "success" };
  } catch (err) {
    logger.info(`A reminder failed ${err.message}`);
    return { status: "error" };
  }
};

//Function to update Reminder
const updateReminderTimes = async (reminderId, newTime) => {
  try {
    const reminder = await Reminder.findOne({ reminderId });
    const job = schedule.scheduledJobs[reminder._id];
    if (job) {
      job.cancel();
    }
    let hour;
    const divTime = newTime.split(/[: ]/);
    if (divTime[2] == "am") {
      hour = divTime[0];
    } else {
      let temp_hour = Number(divTime[0]) + 12;
      hour = temp_hour < 24 ? temp_hour : 0;
    }
    const mins = Number(divTime[1]);
    reminder.hour = hour;
    reminder.time = mins; // Update the time field
    await reminder.save(); // Save the updated reminder
    await scheduleReminder(reminder);

    logger.info("All reminders have been updated.");
  } catch (err) {
    console.error("Error updating reminders:", err);
  }
};

// Function to delete a reminder
async function deleteReminders(userId) {
  try {
    const reminders = await Reminder.find({ userId });

    for (const reminder of reminders) {
      const job = schedule.scheduledJobs[reminder._id];
      if (job) {
        job.cancel();
      }
      await Reminder.findByIdAndDelete(reminder._id);
      logger.info(`Deleted reminder with ID: ${reminder._id}`);
    }
  } catch (err) {
    logger.error(`Error deleting reminders for user ${userId}: ${err.message}`);
  }
}

async function deleteReminder(reminderId) {
  try {
    const reminder = await Reminder.find({ reminderId });
    const job = schedule.scheduledJobs[reminder._id];
    if (job) {
      job.cancel();
    }
    await Reminder.findByIdAndDelete(reminder._id);
    logger.info(`Deleted reminder with ID: ${reminder._id}`);
  } catch (err) {
    logger.error(`Error deleting reminders for user ${userId}: ${err.message}`);
  }
}

module.exports = {
  addReminder,
  scheduleAllReminders,
  deleteReminders,
  deleteReminder,
  updateReminderTimes,
};
