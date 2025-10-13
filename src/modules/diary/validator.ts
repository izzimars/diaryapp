import Joi from 'joi';

// === DIARY BODY VALIDATORS ===

// Create diary validator
export const createDiarySchema = Joi.object({
  content: Joi.string().min(1).max(10000).required().messages({
    'string.empty': 'Content cannot be empty',
    'string.min': 'Content must have at least 1 character',
    'string.max': 'Content cannot exceed 10,000 characters',
    'any.required': 'Content is required',
  }),
  name: Joi.string().min(1).max(200).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must have at least 1 character',
    'string.max': 'Name cannot exceed 200 characters',
    'any.required': 'Name is required',
  }),
  description: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  image: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Image must be a valid URL',
  }),
}).options({ allowUnknown: false });

// Update diary validator (same as create but fields are optional)
export const updateDiarySchema = Joi.object({
  content: Joi.string().min(1).max(10000).optional().messages({
    'string.empty': 'Content cannot be empty',
    'string.min': 'Content must have at least 1 character',
    'string.max': 'Content cannot exceed 10,000 characters',
  }),
  name: Joi.string().min(1).max(200).optional().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must have at least 1 character',
    'string.max': 'Name cannot exceed 200 characters',
  }),
  description: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  image: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Image must be a valid URL',
  }),
})
  .min(1)
  .options({ allowUnknown: false })
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

// === DIARY PARAMETER VALIDATORS ===

// Diary ID parameter validator
export const updateDiaryParamsSchema = Joi.object({
  id: Joi.string()
    .pattern(/^diary-[0-9a-f]{32}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid diary_id format',
      'any.required': 'diary_id is required',
    }),
});

// Alternative diary ID validator (if you use different ID format)
export const diaryIdSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.guid': 'Diary ID must be a valid UUID',
      'any.required': 'Diary ID is required',
    }),
});

// === DIARY QUERY VALIDATORS ===

// Get diaries query validator (for pagination and search)
export const getDiariesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100',
  }),
  search: Joi.string().trim().allow('').optional().messages({
    'string.base': 'Search must be a string',
  }),
  sortBy: Joi.string()
    .valid('created_at', 'updated_at', 'name')
    .default('created_at')
    .messages({
      'any.only': 'Sort by must be one of: created_at, updated_at, name',
    }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': 'Sort order must be either "asc" or "desc"',
  }),
}).options({ allowUnknown: false });

// Get single diary query validator (optional query params)
export const getDiaryQuerySchema = Joi.object({
  includeUser: Joi.boolean().default(false).messages({
    'boolean.base': 'Include user must be a boolean',
  }),
}).options({ allowUnknown: false });
