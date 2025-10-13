import { NotFoundException } from '../../shared/errors';
import { db } from '../../config/database';
import * as diaryParams from './entities';
import diaryQueries from './query';

export interface DiaryRepository {
  createDiary(params: diaryParams.DiaryEntity): Promise<{ id: string }>;
  getDiary(
    id: string,
    searchTerm?: string
  ): Promise<diaryParams.DiaryEntity | NotFoundException>;
  getDiariesByUser(
    userId: string,
    searchTerm?: string,
    limit?: number,
    offset?: number
  ): Promise<diaryParams.DiaryEntity[]>;
  getDiariesByUserCount(
    userId: string,
    searchTerm?: string
  ): Promise<{ total: number }>;
  updateDiary(
    id: string,
    params: Partial<diaryParams.DiaryEntity>
  ): Promise<void>;
  deleteDiary(id: string): Promise<void>;
}

export class DiaryRepositoryImpl implements DiaryRepository {
  public async createDiary(
    params: diaryParams.DiaryEntity
  ): Promise<{ id: string }> {
    return db.tx(async (t) => {
      const result = await t.one(diaryQueries.createDiary, params);
      return { id: result.id };
    });
  }

  public async getDiary(
    id: string,
    searchTerm?: string
  ): Promise<diaryParams.DiaryEntity | NotFoundException> {
    const diary = await db.oneOrNone(diaryQueries.getDiary, [
      id,
      searchTerm || null,
    ]);

    if (!diary) {
      return new NotFoundException('Diary not found');
    }

    return new diaryParams.DiaryEntity({
      id: diary.id,
      name: diary.name,
      content: diary.content,
      user_id: diary.user_id,
      description: diary.description,
      image_url: diary.image_url,
      created_at: diary.created_at,
      updated_at: diary.updated_at,
    });
  }

  public async getDiariesByUser(
    userId: string,
    searchTerm?: string,
    limit?: number,
    offset?: number
  ): Promise<diaryParams.DiaryEntity[]> {
    const diaries = await db.any(diaryQueries.getDiariesByUser, [
      userId,
      searchTerm || null,
      limit || 10,
      offset || 0,
    ]);

    return diaries.map(
      (diary: any) =>
        new diaryParams.DiaryEntity({
          id: diary.id,
          name: diary.name,
          content: diary.content,
          user_id: diary.user_id,
          description: diary.description,
          image_url: diary.image_url,
          created_at: diary.created_at,
          updated_at: diary.updated_at,
        })
    );
  }

  public async getDiariesByUserCount(
    userId: string,
    searchTerm?: string
  ): Promise<{ total: number }> {
    const result = await db.one(diaryQueries.getDiariesByUserCount, [
      userId,
      searchTerm || null,
    ]);
    return { total: parseInt(result.total) };
  }

  public async updateDiary(
    id: string,
    params: Partial<diaryParams.DiaryEntity>
  ): Promise<void> {
    await db.none(diaryQueries.updateDiary, [
      params.name,
      params.content,
      params.image_url,
      params.description,
      id,
    ]);
  }

  public async deleteDiary(id: string): Promise<void> {
    await db.none(diaryQueries.deleteDiary, [id]);
  }
}

const authRepository = new DiaryRepositoryImpl();

export default authRepository;
