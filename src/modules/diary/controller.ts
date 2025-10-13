import * as dtos from './dto';
import diaryServices, { DiaryServices } from './services';
import { AuthenticatedFnRequest, fnRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';
import { NotFoundException, handleCustomError } from '../../shared/errors';

export class DiaryController {
  constructor(private readonly diaryServices: DiaryServices) {}

  public createDiary: AuthenticatedFnRequest = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User authentication required',
      });
    }

    const payload = new dtos.DiaryDto({
      ...req.body,
      user_id: userId,
    });

    const result = await this.diaryServices.createDiary(payload);

    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      statusCode: StatusCodes.CREATED,
      message: 'Diary created successfully',
      data: result,
    });
  };

  public getDiary: fnRequest = async (req, res) => {
    const { id } = req.params;
    const { search } = req.query;

    const result = await this.diaryServices.getDiary(id, search as string);

    if (result instanceof NotFoundException) {
      return handleCustomError(res, result, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'Diary retrieved successfully',
      data: result,
    });
  };

  public getDiariesByUser: AuthenticatedFnRequest = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User authentication required',
      });
    }

    const { search, page = 1, limit = 10 } = req.query;

    const result = await this.diaryServices.getDiariesByUser(
      userId,
      search as string,
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'Diaries retrieved successfully',
      data: result.diaries,
      pagination: result.pagination,
    });
  };

  public updateDiary: AuthenticatedFnRequest = async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User authentication required',
      });
    }

    const result = await this.diaryServices.updateDiary(id, userId, req.body);

    if (result instanceof NotFoundException) {
      return handleCustomError(res, result, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'Diary updated successfully',
    });
  };

  public deleteDiary: AuthenticatedFnRequest = async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'User authentication required',
      });
    }

    const result = await this.diaryServices.deleteDiary(id, userId);

    if (result instanceof NotFoundException) {
      return handleCustomError(res, result, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'Diary deleted successfully',
    });
  };
}

const diaryController = new DiaryController(diaryServices);

export default diaryController;
