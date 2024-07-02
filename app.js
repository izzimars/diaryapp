const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./utils/config");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import routes
const userRoutes = require("./routes/users");
const diaryRoutes = require("./routes/diaries");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/diaries", diaryRoutes);

module.exports = app;
