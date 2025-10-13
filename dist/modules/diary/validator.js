"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiaryQuerySchema = exports.getDiariesQuerySchema = exports.diaryIdSchema = exports.updateDiaryParamsSchema = exports.updateDiarySchema = exports.createDiarySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createDiarySchema = joi_1.default.object({
    content: joi_1.default.string().min(1).max(10000).required().messages({
        'string.empty': 'Content cannot be empty',
        'string.min': 'Content must have at least 1 character',
        'string.max': 'Content cannot exceed 10,000 characters',
        'any.required': 'Content is required',
    }),
    name: joi_1.default.string().min(1).max(200).required().messages({
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must have at least 1 character',
        'string.max': 'Name cannot exceed 200 characters',
        'any.required': 'Name is required',
    }),
    description: joi_1.default.string().max(500).allow('').optional().messages({
        'string.max': 'Description cannot exceed 500 characters',
    }),
    image: joi_1.default.string().uri().allow('').optional().messages({
        'string.uri': 'Image must be a valid URL',
    }),
}).options({ allowUnknown: false });
exports.updateDiarySchema = joi_1.default.object({
    content: joi_1.default.string().min(1).max(10000).optional().messages({
        'string.empty': 'Content cannot be empty',
        'string.min': 'Content must have at least 1 character',
        'string.max': 'Content cannot exceed 10,000 characters',
    }),
    name: joi_1.default.string().min(1).max(200).optional().messages({
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must have at least 1 character',
        'string.max': 'Name cannot exceed 200 characters',
    }),
    description: joi_1.default.string().max(500).allow('').optional().messages({
        'string.max': 'Description cannot exceed 500 characters',
    }),
    image: joi_1.default.string().uri().allow('').optional().messages({
        'string.uri': 'Image must be a valid URL',
    }),
})
    .min(1)
    .options({ allowUnknown: false })
    .messages({
    'object.min': 'At least one field must be provided for update',
});
exports.updateDiaryParamsSchema = joi_1.default.object({
    id: joi_1.default.string()
        .pattern(/^diary-[0-9a-f]{32}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid diary_id format',
        'any.required': 'diary_id is required',
    }),
});
exports.diaryIdSchema = joi_1.default.object({
    id: joi_1.default.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
        'string.guid': 'Diary ID must be a valid UUID',
        'any.required': 'Diary ID is required',
    }),
});
exports.getDiariesQuerySchema = joi_1.default.object({
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
    sortBy: joi_1.default.string()
        .valid('created_at', 'updated_at', 'name')
        .default('created_at')
        .messages({
        'any.only': 'Sort by must be one of: created_at, updated_at, name',
    }),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc').messages({
        'any.only': 'Sort order must be either "asc" or "desc"',
    }),
}).options({ allowUnknown: false });
exports.getDiaryQuerySchema = joi_1.default.object({
    includeUser: joi_1.default.boolean().default(false).messages({
        'boolean.base': 'Include user must be a boolean',
    }),
}).options({ allowUnknown: false });
//# sourceMappingURL=validator.js.map