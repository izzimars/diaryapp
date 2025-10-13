import { Router } from 'express';
import adminController from './controller';
import { RequestParamsValidatorMiddleware } from '../../shared/middlewares/request-params-validator.middleware';
import { RequestBodyValidatorMiddleware } from '../../shared/middlewares/request-body-validator.middleware';
import { RequestQueryValidatorMiddleware } from '../../shared/middlewares/request-query-validator.middleware';
import {
  authenticateToken,
  createAdmin,
  loginAdmin,
  requireRole,
} from '../../shared/middlewares/auth.middleware';
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import {
  createAdminSchema,
  adminLoginSchema,
  updateUserSchema,
  getUsersQuerySchema,
  adminUserIdSchema,
} from './validator';

const adminRouter = Router();

// Admin authentication routes
adminRouter.post(
  '/login',
  RequestBodyValidatorMiddleware(adminLoginSchema),
  loginAdmin,
  WatchAsyncController(adminController.adminLogin)
);

adminRouter.post(
  '/create',
  authenticateToken,
  requireRole(['admin']),
  RequestBodyValidatorMiddleware(createAdminSchema),
  createAdmin,
  WatchAsyncController(adminController.createAdmin)
);

// Admin management routes (require admin authentication)
adminRouter.get(
  '/profile',
  authenticateToken,
  requireRole(['admin']),
  WatchAsyncController(adminController.getProfile)
);

adminRouter.get(
  '/user/:id',
  authenticateToken,
  requireRole(['admin']),
  RequestParamsValidatorMiddleware(adminUserIdSchema),
  WatchAsyncController(adminController.getUser)
);

adminRouter.get(
  '/users',
  authenticateToken,
  requireRole(['admin']),
  RequestQueryValidatorMiddleware(getUsersQuerySchema),
  WatchAsyncController(adminController.getUsers)
);

adminRouter.put(
  '/user/:id',
  authenticateToken,
  requireRole(['admin']),
  RequestParamsValidatorMiddleware(adminUserIdSchema),
  RequestBodyValidatorMiddleware(updateUserSchema),
  WatchAsyncController(adminController.updateUser)
);

adminRouter.delete(
  '/user/:id',
  authenticateToken,
  requireRole(['admin']),
  RequestParamsValidatorMiddleware(adminUserIdSchema),
  WatchAsyncController(adminController.deleteUser)
);

export default adminRouter;
