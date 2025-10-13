"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestBodyValidatorMiddleware = void 0;
const logger_1 = __importDefault(require("../../config/logger"));
const errors_1 = require("../errors");
const RequestBodyValidatorMiddleware = (validationSchema) => (req, _res, next) => {
    const logger = new logger_1.default(exports.RequestBodyValidatorMiddleware.name);
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error != null) {
        logger.log(validationResult.error);
        throw new errors_1.BadException(validationResult.error.message);
    }
    next();
};
exports.RequestBodyValidatorMiddleware = RequestBodyValidatorMiddleware;
//# sourceMappingURL=request-body-validator.middleware.js.map