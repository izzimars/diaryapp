import userRepository, { UserRepository } from '../authentication/repositories';
import adminRepository, { AdminRepository } from './repositories';
import { fnRequest } from '../../shared/types';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../shared/types';
import { StatusCodes } from 'http-status-codes';
import { NotFoundException, handleCustomError } from '../../shared/errors';
import hashing from '../../shared/services/hashing.services';

export class AdminController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository
  ) {}

  public adminLogin: fnRequest = async (
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
      message: 'Admin logged in successfully',
      data: { user: req.user, token },
    });
  };

  public createAdmin: fnRequest = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const adminData = req.body;
    const result = await this.adminRepository.createAdmin(adminData);

    if (result instanceof Error) {
      return handleCustomError(res, result, StatusCodes.BAD_REQUEST);
    }

    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      statusCode: StatusCodes.CREATED,
      message: 'Admin created successfully',
      data: result,
    });
  };

  public getProfile: fnRequest = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const adminId = req.user?.user_id;
    
    if (!adminId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Admin not authenticated',
      });
    }

    const result = await this.adminRepository.getAdmin(adminId);

    if (result instanceof NotFoundException) {
      return handleCustomError(res, result, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'Admin profile retrieved successfully',
      data: result,
    });
  };

  public getUser: fnRequest = async (req, res) => {
    const identifier = req.params.id || req.body.email || req.query.email;
    const result = await this.userRepository.getUser(identifier);

    if (result instanceof NotFoundException) {
      return handleCustomError(res, result, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'User retrieved successfully',
      data: result,
    });
  };

  public getUsers: fnRequest = async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const offset =
      (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);

    const [users, countResult] = await Promise.all([
      this.userRepository.getUsers(
        search as string,
        parseInt(limit as string, 10),
        offset
      ),
      this.userRepository.getUsersCount(search as string),
    ]);

    const totalUsers = countResult.total;
    const totalPages = Math.ceil(totalUsers / parseInt(limit as string, 10));

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        currentPage: parseInt(page as string, 10),
        totalPages,
        totalUsers,
        hasNextPage: parseInt(page as string, 10) < totalPages,
        hasPrevPage: parseInt(page as string, 10) > 1,
      },
    });
  };

  public updateUser: fnRequest = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    const result = await this.userRepository.updateUser(userId, updateData);

    if (result instanceof NotFoundException) {
      return handleCustomError(res, result, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'User updated successfully',
      data: result,
    });
  };

  public deleteUser: fnRequest = async (req, res) => {
    const userId = req.params.id;

    const result = await this.userRepository.deleteUser(userId);

    if (result instanceof NotFoundException) {
      return handleCustomError(res, result, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
      status: 'success',
      statusCode: StatusCodes.OK,
      message: 'User deleted successfully',
    });
  };
}

const adminController = new AdminController(userRepository, adminRepository);

export default adminController;
