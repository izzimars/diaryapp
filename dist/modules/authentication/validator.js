"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationQuerySchema = exports.flexibleUserIdentifierSchema = exports.userIdOrEmailSchema = exports.userIdentifierSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.registerUserSchema = exports.verifyOtpSchema = exports.loginUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),
});
exports.verifyOtpSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    otp: joi_1.default.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
        'string.length': 'OTP must be exactly 6 digits',
        'string.pattern.base': 'OTP must contain only numbers',
        'any.required': 'OTP is required',
    }),
});
exports.registerUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    role: joi_1.default.string().valid('user', 'admin').default('user').messages({
        'any.only': 'Role must be either "user" or "admin"',
    }),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
});
exports.resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    otp: joi_1.default.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
        'string.length': 'OTP must be exactly 6 digits',
        'string.pattern.base': 'OTP must contain only numbers',
        'any.required': 'OTP is required',
    }),
    newPassword: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required',
    }),
});
exports.userIdentifierSchema = joi_1.default.object({
    identifier: joi_1.default.alternatives()
        .try(joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .message('Must be a valid UUID'), joi_1.default.string().email().message('Must be a valid email address'))
        .required()
        .messages({
        'alternatives.match': 'Parameter must be either a valid UUID or email address',
        'any.required': 'User identifier is required',
    }),
});
exports.userIdOrEmailSchema = joi_1.default.object({
    id: joi_1.default.alternatives()
        .try(joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .message('Must be a valid UUID'), joi_1.default.string().email().message('Must be a valid email address'))
        .required()
        .messages({
        'alternatives.match': 'Parameter must be either a valid UUID or email address',
        'any.required': 'User identifier is required',
    }),
});
exports.flexibleUserIdentifierSchema = joi_1.default.object({
    id: joi_1.default.string()
        .min(1)
        .required()
        .custom((value, helpers) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (uuidRegex.test(value) || emailRegex.test(value)) {
            return value;
        }
        return helpers.error('custom.invalidIdentifier');
    }, 'User identifier validation')
        .messages({
        'custom.invalidIdentifier': 'Parameter must be either a valid UUID or email address',
        'string.min': 'User identifier cannot be empty',
        'any.required': 'User identifier is required',
    }),
});
exports.paginationQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1',
    }),
    limit: joi_1.default.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100',
    }),
    search: joi_1.default.string().trim().allow('').optional().messages({
        'string.base': 'Search must be a string',
    }),
}).options({ allowUnknown: false });
//# sourceMappingURL=validator.js.map