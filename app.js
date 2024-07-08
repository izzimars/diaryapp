const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./utils/config");
const logger = require("./utils/logger");
const userRoutes = require("./controllers/user");
const { diaryrouter, fetchEmails } = require("./controllers/diary");
const cors = require("cors");
const middleware = require("./utils/middleware");
const { swaggerUi, swaggerDocs } = require("./swagger");

const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI, {})
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("MongoDB connection error:", err));

//middleware for requests before routes access
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
//app.use(middleware.requestLogger);
app.use(bodyParser.json());
fetchEmails();
// Use routes
app.use("/api/users", userRoutes);
app.use("/api/diaries", diaryrouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//middleware to handle errors in utils module
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
