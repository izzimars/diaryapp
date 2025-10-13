import { fnRequest } from '../../shared/types';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';

import hashing from '../../shared/services/hashing.services';

export class AuthController {
  constructor() {}

  public loginUser: fnRequest = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'OTP sent to email successfully',
      data: req.user,
    });
  };

  public verifyUser: fnRequest = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const token = hashing.sign({
      id: req?.user?.user_id ?? '',
      email: req?.user?.email ?? '',
    });

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'User verified successfully',
      data: { token, user: req?.user },
    });
  };

  public AdminLogin: fnRequest = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'OTP sent to email successfully',
      data: req.user,
    });
  };
}

const authController = new AuthController();

export default authController;
