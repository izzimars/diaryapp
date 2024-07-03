const {constants} = require('../constants');
const logger = require("./logger");


const errorHandler = (err,req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    logger.error(error.message);

    switch (statusCode) {
      case constants.Validation_Error:
        res.json({
          title: "Validation_Error",
          message: err.message,
          stackTrace: err,
          stack,
        });
        break;
      case constants.forbidden:
        res.json({
          title: "Foridden",
          message: err.message,
          stackTrace: err,
          stack,
        });
        break;
      case constants.Unauthorized:
        res.json({
          title: "Unauthorized",
          message: err.message,
          stackTrace: err,
          stack,
        });
        break;
      case constants.Not_Found:
        res.json({
          title: "Not_Found",
          message: err.message,
          stackTrace: err,
          stack,
        });
        break;
        case constants.Server_Error:
            res.json({title : "Server_Error" ,message : err.message , stackTrace : err,stack})            
            break;

      default:
        break;
    }
}

module.exports = errorHandler