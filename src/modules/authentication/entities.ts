import { BaseEntity } from '../../shared/utils/base-entity';

export class CreateUserEntity extends BaseEntity<CreateUserEntity> {
  email: string;
  verified?: boolean;
  role?: 'user' | 'admin';
  otp?: string;
  otp_expiry?: string;
}

export class UserEntity extends BaseEntity<UserEntity> {
  id: string;
  user_id: string;
  email: string;
  verified: boolean;
  role: 'user' | 'admin';
  otp?: string;
  otp_expiry?: string;
  created_at?: Date;
  updated_at?: Date;
}

// UserOtpEntity with OTP expiry information
export class UserOtpEntity extends BaseEntity<UserOtpEntity> {
  id: string;
  user_id: string;
  email: string;
  verified: boolean;
  role: 'user' | 'admin';
  otp?: string;
  otp_expiry?: string;
  created_at?: Date;
  updated_at?: Date;
}
