import Joi from 'joi';

// === AUTHENTICATION BODY VALIDATORS ===

// Login user validator
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  }),
});

// Verify OTP validator
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required',
    }),
});

// Register user validator (if you have registration)
export const registerUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  role: Joi.string().valid('user', 'admin').default('user').messages({
    'any.only': 'Role must be either "user" or "admin"',
  }),
});

// Forgot password validator
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

// Reset password validator
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required',
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required',
    }),
});

// === PARAMETER VALIDATORS ===

// Validation schema for user identifier (can be either ID or email)
export const userIdentifierSchema = Joi.object({
  identifier: Joi.alternatives()
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

// If your route uses :id parameter name instead of :identifier
export const userIdOrEmailSchema = Joi.object({
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

// More flexible version that accepts any string but provides helpful error messages
export const flexibleUserIdentifierSchema = Joi.object({
  id: Joi.string()
    .min(1)
    .required()
    .custom((value, helpers) => {
      // Check if it's a valid UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      // Check if it's a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (uuidRegex.test(value) || emailRegex.test(value)) {
        return value;
      }

      return helpers.error('custom.invalidIdentifier');
    }, 'User identifier validation')
    .messages({
      'custom.invalidIdentifier':
        'Parameter must be either a valid UUID or email address',
      'string.min': 'User identifier cannot be empty',
      'any.required': 'User identifier is required',
    }),
});

// === QUERY VALIDATORS ===

// Pagination and search query validator
export const paginationQuerySchema = Joi.object({
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
}).options({ allowUnknown: false });
