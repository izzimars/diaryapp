import Joi from 'joi';

export const createAdminSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  }),
  role: Joi.string().valid('admin').default('admin').messages({
    'any.only': 'Role must be "admin"',
  }),
}).options({ allowUnknown: false });

// Admin login validator
export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
}).options({ allowUnknown: false });

// Update user validator (for admin updating users)
export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address',
  }),
  verified: Joi.boolean().optional().messages({
    'boolean.base': 'Verified must be a boolean value',
  }),
  role: Joi.string().valid('user', 'admin').optional().messages({
    'any.only': 'Role must be one of: user, admin',
  }),
})
  .min(1)
  .options({ allowUnknown: false })
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

// === ADMIN QUERY VALIDATORS ===

// Get users query validator (for admin viewing all users)
export const getUsersQuerySchema = Joi.object({
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
  role: Joi.string().valid('user', 'admin').optional().messages({
    'any.only': 'Role filter must be one of: user, admin',
  }),
  verified: Joi.boolean().optional().messages({
    'boolean.base': 'Verified filter must be a boolean',
  }),
  sortBy: Joi.string()
    .valid('created_at', 'updated_at', 'email', 'verified')
    .default('created_at')
    .messages({
      'any.only':
        'Sort by must be one of: created_at, updated_at, email, verified',
    }),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': 'Sort order must be either "asc" or "desc"',
  }),
}).options({ allowUnknown: false });

// === ADMIN PARAMETER VALIDATORS ===

// User ID parameter validator (for admin operations)
export const adminUserIdSchema = Joi.object({
  id: Joi.alternatives()
    .try(
      // UUID format for user ID
      Joi.string()
        .guid({ version: ['uuidv4'] })
        .message('Must be a valid UUID'),
      // Email format
      Joi.string().email().message('Must be a valid email address')
    )
    .required()
    .messages({
      'alternatives.match':
        'Parameter must be either a valid UUID or email address',
      'any.required': 'User identifier is required',
    }),
});

// Admin ID parameter validator (stricter, UUID only)
export const adminIdSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.guid': 'Admin ID must be a valid UUID',
      'any.required': 'Admin ID is required',
    }),
});

// === ADMIN ROLE VALIDATORS ===

// Role assignment validator
export const assignRoleSchema = Joi.object({
  userId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.guid': 'User ID must be a valid UUID',
      'any.required': 'User ID is required',
    }),
  role: Joi.string().valid('user', 'admin').required().messages({
    'any.only': 'Role must be one of: user, admin',
    'any.required': 'Role is required',
  }),
}).options({ allowUnknown: false });

// Bulk operations validator
export const bulkOperationSchema = Joi.object({
  userIds: Joi.array()
    .items(Joi.string().guid({ version: ['uuidv4'] }))
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.min': 'At least one user ID is required',
      'array.max': 'Cannot process more than 50 users at once',
      'any.required': 'User IDs are required',
    }),
  action: Joi.string()
    .valid('delete', 'verify', 'unverify', 'promote', 'demote')
    .required()
    .messages({
      'any.only':
        'Action must be one of: delete, verify, unverify, promote, demote',
      'any.required': 'Action is required',
    }),
}).options({ allowUnknown: false });
