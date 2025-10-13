import { BaseEntity } from '../../shared/utils/base-entity';

// DTO for creating a new user (request input)
export class CreateUserDto extends BaseEntity<CreateUserDto> {
  email: string;
}

export class LoginUserDto extends BaseEntity<LoginUserDto> {
  email: string;
  otp: string;
}

export class VerifyOtpDto extends BaseEntity<VerifyOtpDto> {
  email: string;
  otp: string;
}

export class UserResponseDto extends BaseEntity<UserResponseDto> {
  id: string;
  email: string;
  verified: boolean;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export class UpdateUserDto extends BaseEntity<UpdateUserDto> {
  email?: string;
  role?: 'user' | 'admin';
}
