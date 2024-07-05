const mongoose = require("mongoose");
const ReminderSchemaSchema = mongoose.Schema;

const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hour: { type: String, required: true },
  time: { type: String, required: true },
});
