import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Logger from '../../config/logger';
import { BadException } from '../errors';

export const RequestParamsValidatorMiddleware =
  <T>(validationSchema: Joi.ObjectSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const logger = new Logger(RequestParamsValidatorMiddleware.name);

    const validationResult = validationSchema.validate(req.params);

    if (validationResult.error != null) {
      logger.log(validationResult.error);
      throw new BadException(validationResult.error.message);
    }

    next();
  };
