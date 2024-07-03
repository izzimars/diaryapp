const Joi = require('joi')


const signupSchema = Joi.object({
    Fullname: Joi.string().min(3).max(50).required(),
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).required(),
    phonenumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).messages({
        'string.pattern.base': 'Phone number must be a valid international format'
    }).required,
    password:Joi.string().min(3).max(20).required(),

}).with('username', 'password')
.with('bookname',[ 'genre' , 'date', 'id']);

const loginSchema = Joi.object({
    username: Joi.string().min(3).max(20).optiona(),
    email: Joi.string().min(3).max(20).optional(),
    password:Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/)
    .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain both letters and numbers',
    }),
    
}).with('password', ['username' , 'email']);

const forgotPasswordSchema = Joi.object({
    password:Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/)
    .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain both letters and numbers',
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match'
      })
    
}).with('password', ['username' , 'email']);

const dateSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
      'date.min': 'End date must be greater than or equal to start date'
    })
  });

module.exports = {
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    dateSchema};