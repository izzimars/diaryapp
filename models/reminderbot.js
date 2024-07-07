const mongoose = require("mongoose");
const ReminderSchemaSchema = mongoose.Schema;

const ReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  hour: { type: Number, required: true },
  time: { type: Number, required: true },
});
