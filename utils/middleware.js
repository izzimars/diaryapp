const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "No token provided",
    });
  }
  // Bearer token handling if token comes in the format 'Bearer <token>'
  const bearerToken = token.split(" ")[1];
  jwt.verify(bearerToken, config.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "Failed to authenticate token",
      });
    }
    // If token is successfully verified, attach userId to request object
    req.userId = decoded.userId;
    next();
  });
};

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({
      status: "error",
      message: error.message,
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({
      status: "error",
      message: error.message,
    });
  } else if (error.name === "ReferenceError") {
    console.log(error);
    return response.status(400).json({
      status: "error",
      message: error.message,
    });
  }
  next(error);
};

const unknownEndpoint = (err, req, res, next) => {
  return res.status(404).json({
    status: "error",
    message: err.message || "Unknown endpoint",
  });
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  verifyToken,
};
