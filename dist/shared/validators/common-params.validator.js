"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleIdsSchema = exports.paginationWithSearchSchema = exports.searchParamsSchema = exports.paginationParamsSchema = exports.emailParamSchema = exports.uuidParamSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.uuidParamSchema = joi_1.default.object({
    id: joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
        'string.guid': 'Invalid ID format. Must be a valid UUID.',
        'any.required': 'ID parameter is required',
    }),
});
exports.emailParamSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email parameter is required',
    }),
});
exports.paginationParamsSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1).optional(),
    limit: joi_1.default.number().integer().min(1).max(100).default(10).optional(),
});
exports.searchParamsSchema = joi_1.default.object({
    search: joi_1.default.string().min(1).max(255).optional().allow(''),
});
exports.paginationWithSearchSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1).optional(),
    limit: joi_1.default.number().integer().min(1).max(100).default(10).optional(),
    search: joi_1.default.string().min(1).max(255).optional().allow(''),
});
exports.multipleIdsSchema = joi_1.default.object({
    ids: joi_1.default.array()
        .items(joi_1.default.string().guid({ version: ['uuidv4'] }))
        .min(1)
        .max(50)
        .required()
        .messages({
        'array.min': 'At least one ID is required',
        'array.max': 'Maximum 50 IDs allowed',
        'string.guid': 'All IDs must be valid UUIDs',
    }),
});
//# sourceMappingURL=common-params.validator.js.map