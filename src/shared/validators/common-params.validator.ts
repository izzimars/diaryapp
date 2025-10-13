import Joi from 'joi';

// Common parameter validation schemas

// Standard UUID validation (for most ID parameters)
export const uuidParamSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.guid': 'Invalid ID format. Must be a valid UUID.',
      'any.required': 'ID parameter is required',
    }),
});

// Email parameter validation
export const emailParamSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email parameter is required',
  }),
});

// Pagination parameters
export const paginationParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
});

// Search parameters
export const searchParamsSchema = Joi.object({
  search: Joi.string().min(1).max(255).optional().allow(''),
});

// Combined pagination and search
export const paginationWithSearchSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  search: Joi.string().min(1).max(255).optional().allow(''),
});

// Multiple IDs (for bulk operations)
export const multipleIdsSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.string().guid({ version: ['uuidv4'] }))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one ID is required',
      'array.max': 'Maximum 50 IDs allowed',
      'string.guid': 'All IDs must be valid UUIDs',
    }),
});