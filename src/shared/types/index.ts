import { Request, Response, NextFunction } from 'express';

// Custom Request interface that includes user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    user_id: string;
    email?: string;
    verified?: boolean;
    role?: 'user' | 'admin';
    otp?: string;
    created_at?: Date;
    updated_at?: Date;
  };
}

export type ExpressController = (
  req: Request,
  res: Response,
  next?: NextFunction
) => any;

export type fnRequest = (req: Request, res: Response) => Promise<any>;

export type AuthenticatedFnRequest = (
  req: AuthenticatedRequest,
  res: Response
) => Promise<any>;
