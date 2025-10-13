import { Router } from 'express';
import authenticationController from './controller';
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import { RequestBodyValidatorMiddleware } from '../../shared/middlewares/request-body-validator.middleware';
import { loginUserSchema, verifyOtpSchema } from './validator';
import {
  loginUser,
  verifyOtp,
} from '../../shared/middlewares/auth.middleware';

const authenticationRouter = Router();

// Public routes (no authentication required)
authenticationRouter.post(
  '/login',
  RequestBodyValidatorMiddleware(loginUserSchema),
  loginUser,
  WatchAsyncController(authenticationController.loginUser)
);

authenticationRouter.post(
  '/verify-otp',
  RequestBodyValidatorMiddleware(verifyOtpSchema),
  verifyOtp,
  WatchAsyncController(authenticationController.verifyUser)
);

export default authenticationRouter;
