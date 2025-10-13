import express from 'express';
import diaryRouter from '../../modules/diary/routes';
import authRouter from '../../modules/authentication/routes';
import adminRouter from '../../modules/admin/routes';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/diary', diaryRouter);
appRouter.use('/admin', adminRouter);

export const Router = appRouter;
