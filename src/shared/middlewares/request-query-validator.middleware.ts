import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCodes } from 'http-status-codes';

export const RequestQueryValidatorMiddleware = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');

      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Query validation failed',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
        details: errorMessage,
      });
      return;
    }

    // Replace req.query with validated and sanitized values
    req.query = value;
    next();
  };
};
