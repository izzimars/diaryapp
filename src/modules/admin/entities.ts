import { BaseEntity } from '../../shared/utils/base-entity';

export class CreateAdminEntity extends BaseEntity<CreateAdminEntity> {
  email: string;
  password: string;
  verified?: boolean;
  role: 'admin';
}

export class AdminEntity extends BaseEntity<AdminEntity> {
  id: string;
  user_id: string;
  email: string;
  password?: string;
  verified: boolean;
  role: 'admin';
  created_at?: Date;
  updated_at?: Date;
}

export class AdminResponseEntity extends BaseEntity<AdminResponseEntity> {
  id: string;
  user_id: string;
  email: string;
  verified: boolean;
  role: 'admin';
  created_at?: Date;
  updated_at?: Date;
}
