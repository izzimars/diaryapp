"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestQueryValidatorMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const RequestQueryValidatorMiddleware = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: 'error',
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Query validation failed',
                errors: error.details.map((detail) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                })),
                details: errorMessage,
            });
            return;
        }
        req.query = value;
        next();
    };
};
exports.RequestQueryValidatorMiddleware = RequestQueryValidatorMiddleware;
//# sourceMappingURL=request-query-validator.middleware.js.map