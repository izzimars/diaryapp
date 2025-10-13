import { BaseEntity } from '../../shared/utils/base-entity';

export class DiaryDto extends BaseEntity<DiaryDto> {
  id: string;
  user_id: string;
  description?: string;
  content: string;
  image_url?: string;
  created_at?: Date;
  updated_at?: Date;
  name: string;
}
