const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  return res.status(400).json({
    status: "error",
    message: error.message,
    error: "unknown endpoint",
  });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: error.message,
      error: "malformatted id",
    });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: error.message,
      error: "ValidationError",
    });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
