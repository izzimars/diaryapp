import { Router } from 'express';
import diaryController from './controller';
import { WatchAsyncController } from '../../shared/utils/watch-async-controller';
import * as validators from './validator';
import { RequestBodyValidatorMiddleware } from '../../shared/middlewares/request-body-validator.middleware';
import { RequestParamsValidatorMiddleware } from '../../shared/middlewares/request-params-validator.middleware';
import { RequestQueryValidatorMiddleware } from '../../shared/middlewares/request-query-validator.middleware';
import {
  authenticateToken,
  requireRole,
  checkDiaryOwnership,
} from '../../shared/middlewares/auth.middleware';

const diaryRouter = Router();

diaryRouter.post(
  '/',
  RequestBodyValidatorMiddleware(validators.createDiarySchema),
  authenticateToken,
  requireRole(['user', 'admin']),
  WatchAsyncController(diaryController.createDiary)
);

diaryRouter.get(
  '/:id',
  RequestParamsValidatorMiddleware(validators.updateDiaryParamsSchema),
  RequestQueryValidatorMiddleware(validators.getDiaryQuerySchema),
  authenticateToken,
  requireRole(['user', 'admin']),
  checkDiaryOwnership,
  WatchAsyncController(diaryController.getDiary)
);

diaryRouter.get(
  '/',
  RequestQueryValidatorMiddleware(validators.getDiariesQuerySchema),
  authenticateToken,
  requireRole(['user', 'admin']),
  WatchAsyncController(diaryController.getDiariesByUser)
);

diaryRouter.put(
  '/:id',
  RequestParamsValidatorMiddleware(validators.updateDiaryParamsSchema),
  RequestBodyValidatorMiddleware(validators.updateDiarySchema),
  authenticateToken,
  requireRole(['user', 'admin']),
  checkDiaryOwnership,
  WatchAsyncController(diaryController.updateDiary)
);

diaryRouter.delete(
  '/:id',
  RequestParamsValidatorMiddleware(validators.updateDiaryParamsSchema),
  authenticateToken,
  checkDiaryOwnership,
  requireRole(['user', 'admin']),
  WatchAsyncController(diaryController.deleteDiary)
);

export default diaryRouter;
