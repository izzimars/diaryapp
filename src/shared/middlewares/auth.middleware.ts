import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthenticatedRequest } from '../types';
import userRepository from '../../modules/authentication/repositories';
import diaryRepository from '../../modules/diary/repositories';
import adminRepository from '../../modules/admin/repositories';
import { NotFoundException, BadException } from '../errors';
import hashing from '../../shared/services/hashing.services';

export const loginUser = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const user = await userRepository.getUser(email);
  const otp = hashing.generateTOTP();
  if (user instanceof NotFoundException) {
    const createdUser = await userRepository.createUser({
      email,
      role: 'user',
      verified: false,
      otp,
      otp_expiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
    req.user = {
      id: createdUser.id,
      user_id: createdUser.user_id ?? createdUser.id,
      email: createdUser.email,
      verified: createdUser.verified,
      role: createdUser.role,
      otp: otp,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at,
    };
  } else {
    await userRepository.updateOtp(
      email,
      otp,
      new Date(Date.now() + 5 * 60 * 1000).toISOString()
    );
    user.otp = otp;
    req.user = {
      id: user.id,
      user_id: user.user_id ?? user.id,
      email: user.email,
      verified: user.verified,
      role: user.role,
      otp: user.otp,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
  next();
};

export const verifyOtp = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const { email, otp } = req.body;

  const user = await userRepository.getUser(email);
  if (user instanceof NotFoundException) {
    return next(new NotFoundException('User not found'));
  }
  if (
    !user.otp ||
    !hashing.compare(user.otp, otp) ||
    !user.otp_expiry ||
    new Date(user.otp_expiry) < new Date()
  ) {
    return next(new BadException('Invalid OTP'));
  }
  req.user = {
    id: user.id,
    user_id: user.user_id ?? user.id,
    email: user.email,
    verified: user.verified,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
  next();
};

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Access token required',
    });
    return;
  }

  const decoded = hashing.verify(token) as {
    id?: string;
    email?: string;
  };
  if (!decoded || !decoded.id) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid token',
    });
    return;
  }

  const user = await userRepository.getUser(decoded.id);

  if (user instanceof NotFoundException) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Invalid token - user not found',
    });
    return;
  }

  req.user = {
    id: user.id,
    user_id: user.user_id ?? user.id,
    role: user.role,
  };

  next();
};

export const requireRole = (roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Authentication required',
      });
      return;
    }

    if (!req.user?.role || !roles.includes(req.user.role)) {
      res.status(StatusCodes.FORBIDDEN).json({
        status: 'error',
        statusCode: StatusCodes.FORBIDDEN,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const loginAdmin = async (
  req: AuthenticatedRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const { password, email } = req.body;

  const admin = await adminRepository.getAdmin(email);

  if (admin instanceof NotFoundException) {
    return next(new NotFoundException('Admin not found'));
  }

  if (!admin.password || !(await hashing.compare(admin.password, password))) {
    return next(new BadException('Invalid credentials'));
  }

  req.user = {
    id: admin.id,
    user_id: admin.user_id ?? admin.id,
    email: admin.email,
    verified: admin.verified,
    role: admin.role,
    created_at: admin.created_at,
    updated_at: admin.updated_at,
  };

  next();
};

export const createAdmin = async (
  req: AuthenticatedRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  const admin = await adminRepository.createAdmin({
    email,
    password: await hashing.hash(password),
    role: 'admin',
  });

  if (admin instanceof NotFoundException) {
    return next(new NotFoundException('Admin not found'));
  }

  req.user = {
    id: admin.id,
    user_id: admin.user_id ?? admin.id,
    email: admin.email,
    verified: admin.verified,
    role: admin.role,
    created_at: admin.created_at,
    updated_at: admin.updated_at,
  };

  next();
};

export const checkDiaryOwnership = async(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  if (!req.user || !req.user.user_id) {
    return next(new BadException('User information missing'));
  }
  const { user_id } = req.user;

  const diary = await diaryRepository.getDiary(id);

  if (diary instanceof NotFoundException) {
    return next(new NotFoundException('Diary not found'));
  }
  
  if (diary.user_id !== user_id) {
    return next(new BadException('You do not have permission to access this diary'));
  }

  next();
};
