const schedule = require('node-schedule');
const nodemailer = require("nodemailer");

// Function to send a reminder
async function sendReminder(user) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "your_email@gmail.com", pass: "your_email_password" },
      });
      const mailOptions = {
        from: "your_email@gmail.com",
        to: user.email,
        subject: "Entry Reminder",
        text: `Hello ${user.username}, it is time for a new dairy entry in your personal dove diary. \n 
        Make your new entries here and view them on your dashboard later.`,
      };
      await transporter.sendMail(mailOptions);
}

// Function to schedule a reminder
function scheduleReminder(hour, minute,user) {
  // Create a schedule rule
  const rule = new schedule.RecurrenceRule();
  rule.hour = hour;
  rule.minute = minute;

  // Schedule the reminder
  schedule.scheduleJob(rule, sendReminder(user));
}

function makeReminder(day, user){
    if (day){
        // destructure day depending on how it is inputed
        scheduleReminder(hour,minute, user)        
    }else{
        next();
    }
}

module.export= {
    makeReminder
}