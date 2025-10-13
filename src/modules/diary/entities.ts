import { BaseEntity } from '../../shared/utils/base-entity';

export class DiaryEntity extends BaseEntity<DiaryEntity> {
  id?: string;
  diary_id?: string;
  name: string;
  user_id: string;
  description?: string;
  content: string;
  image_url?: string;
  created_at?: Date;
  updated_at?: Date;
}
