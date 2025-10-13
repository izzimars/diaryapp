"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkOperationSchema = exports.assignRoleSchema = exports.adminIdSchema = exports.adminUserIdSchema = exports.getUsersQuerySchema = exports.updateUserSchema = exports.adminLoginSchema = exports.createAdminSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAdminSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
    }),
    role: joi_1.default.string().valid('admin').default('admin').messages({
        'any.only': 'Role must be "admin"',
    }),
}).options({ allowUnknown: false });
exports.adminLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
}).options({ allowUnknown: false });
exports.updateUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().optional().messages({
        'string.email': 'Please provide a valid email address',
    }),
    verified: joi_1.default.boolean().optional().messages({
        'boolean.base': 'Verified must be a boolean value',
    }),
    role: joi_1.default.string().valid('user', 'admin').optional().messages({
        'any.only': 'Role must be one of: user, admin',
    }),
})
    .min(1)
    .options({ allowUnknown: false })
    .messages({
    'object.min': 'At least one field must be provided for update',
});
exports.getUsersQuerySchema = joi_1.default.object({
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
    role: joi_1.default.string().valid('user', 'admin').optional().messages({
        'any.only': 'Role filter must be one of: user, admin',
    }),
    verified: joi_1.default.boolean().optional().messages({
        'boolean.base': 'Verified filter must be a boolean',
    }),
    sortBy: joi_1.default.string()
        .valid('created_at', 'updated_at', 'email', 'verified')
        .default('created_at')
        .messages({
        'any.only': 'Sort by must be one of: created_at, updated_at, email, verified',
    }),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc').messages({
        'any.only': 'Sort order must be either "asc" or "desc"',
    }),
}).options({ allowUnknown: false });
exports.adminUserIdSchema = joi_1.default.object({
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
exports.adminIdSchema = joi_1.default.object({
    id: joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
        'string.guid': 'Admin ID must be a valid UUID',
        'any.required': 'Admin ID is required',
    }),
});
exports.assignRoleSchema = joi_1.default.object({
    userId: joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
        'string.guid': 'User ID must be a valid UUID',
        'any.required': 'User ID is required',
    }),
    role: joi_1.default.string().valid('user', 'admin').required().messages({
        'any.only': 'Role must be one of: user, admin',
        'any.required': 'Role is required',
    }),
}).options({ allowUnknown: false });
exports.bulkOperationSchema = joi_1.default.object({
    userIds: joi_1.default.array()
        .items(joi_1.default.string().guid({ version: ['uuidv4'] }))
        .min(1)
        .max(50)
        .required()
        .messages({
        'array.min': 'At least one user ID is required',
        'array.max': 'Cannot process more than 50 users at once',
        'any.required': 'User IDs are required',
    }),
    action: joi_1.default.string()
        .valid('delete', 'verify', 'unverify', 'promote', 'demote')
        .required()
        .messages({
        'any.only': 'Action must be one of: delete, verify, unverify, promote, demote',
        'any.required': 'Action is required',
    }),
}).options({ allowUnknown: false });
//# sourceMappingURL=validator.js.map