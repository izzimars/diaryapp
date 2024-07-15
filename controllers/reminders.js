const express = require("express");
const Reminder = require("../models/reminderbot");
const remindersroute = express.Router();
const config = require("../utils/config");
const logger = require("../utils/logger");
const middleware = require("../utils/middleware");
const secret = config.SECRET;
const { timeSchema } = require("../models/validationschema");
const validate = require("../utils/validate");
const makeReminder = require("../models/reminderbot");

const {
  addReminder,
  deleteReminders,
  deleteReminder,
  updateReminderTimes,
} = require("./reminderbot");

// getting all reminders
remindersroute.get("/", middleware.verifyToken, async (req, res) => {
  const userId = req.userId;
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
remindersroute.post(
  "/addnew",
  middleware.verifyToken,
  validate(timeSchema),
  async (req, res) => {
    let reminders = req.body.times;
    let newreminders = [];
    try {
      let timeArr = [];
      let convDbArr = [];
      let dbArr = await Reminder.find({ userId: req.userId });
      for (const time of reminders) {
        let hour;
        const divTime = time.split(/[: ]/);
        if (divTime[2] == "am") {
          hour = Number(divTime[0]);
        } else {
          let temp_hour = Number(divTime[0]) + 12;
          hour = temp_hour < 24 ? temp_hour : 0;
        }
        let arr = [hour, Number(divTime[1])];
        timeArr.push(arr);
      }
      for (let i = 0; i < dbArr.length; i++) {
        let arr = [dbArr[i].hour, dbArr[i].time];
        convDbArr.push(arr);
      }
      for (let i = 0; i < timeArr.length; i++) {
        let flag = false;
        for (let j = 0; j < convDbArr.length; j++) {
          if (
            timeArr[i].every((element, index) => {
              return element === convDbArr[j][index];
            })
          ) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          newreminders.push(reminders[i]);
        }
      }
      if (newreminders.length != 0) {
        var suc = 0;
        var fai = 0;
        for (const time of newreminders) {
          let rem = await addReminder(req.userId, time);
          if (rem.status === "success") {
            suc += 1;
          } else if (rem.status === "error") {
            fai += 1;
          }
        }
        return res.status(200).json({
          status: "success",
          message: `${fai} failures and ${suc} success`,
        });
      } else {
        return res.status(200).json({
          status: "success",
          message: `Reminders already exists`,
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "error in creating reminders",
      });
    }
  }
);

//update reminder
// remindersroute.patch("/update",validate(timeSchema), async (req, res) => {
//   const { reminderId, newTime } = req.body;
//   try {
//     const reminders = updateReminderTimes(reminderId, newTime);
//     //const reminders = await Reminder.findOne({ reminderId });
//     return res.status(200).json({
//       status: "success",
//       message: "Reminder successfully updated",
//       data: reminders,
//     });
//   } catch (err) {
//     console.error("Error updating reminder", err);
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//       error: "Internal Server Error",
//     });
//   }
// });

//delete a reminder
remindersroute.delete("/delete/:id", async (req, res) => {
  const reminderId = req.params.id;
  console.log(reminderId);
  try {
    deleteReminder(reminderId);
    return res.status(200).json({
      status: "success",
      message: "Reminder successfully deleted",
    });
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
// remindersroute.delete("/deleteall", async (req, res) => {
//   const userId = req.body;
//   try {
//     deleteReminders(userId);
//     return res.status(200).json({
//       status: "success",
//       message: "Reminders successfully deleted",
//     });
//   } catch (err) {
//     console.error("Error deleting reminders", err);
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//       error: "Internal Server Error",
//     });
//   }
// });

module.exports = remindersroute;
