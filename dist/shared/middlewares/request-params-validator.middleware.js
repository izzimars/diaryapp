"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParamsValidatorMiddleware = void 0;
const logger_1 = __importDefault(require("../../config/logger"));
const errors_1 = require("../errors");
const RequestParamsValidatorMiddleware = (validationSchema) => (req, _res, next) => {
    const logger = new logger_1.default(exports.RequestParamsValidatorMiddleware.name);
    const validationResult = validationSchema.validate(req.params);
    if (validationResult.error != null) {
        logger.log(validationResult.error);
        throw new errors_1.BadException(validationResult.error.message);
    }
    next();
};
exports.RequestParamsValidatorMiddleware = RequestParamsValidatorMiddleware;
//# sourceMappingURL=request-params-validator.middleware.js.map