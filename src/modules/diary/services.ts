import diaryRepository, { DiaryRepository } from './repositories';
import * as diaryParams from './entities';
import { NotFoundException } from '../../shared/errors';

export interface DiaryServices {
  createDiary(params: diaryParams.DiaryEntity): Promise<{ id: string }>;
  getDiary(
    id: string,
    searchTerm?: string
  ): Promise<NotFoundException | diaryParams.DiaryEntity>;
  getDiariesByUser(
    userId: string,
    searchTerm?: string,
    page?: number,
    limit?: number
  ): Promise<{
    diaries: diaryParams.DiaryEntity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>;
  updateDiary(
    id: string,
    userId: string,
    params: Partial<diaryParams.DiaryEntity>
  ): Promise<NotFoundException | void>;
  deleteDiary(id: string, userId: string): Promise<NotFoundException | void>;
}

export class DiaryServiceImpl implements DiaryServices {
  constructor(private readonly diaryRepository: DiaryRepository) {}

  public async createDiary(
    params: diaryParams.DiaryEntity
  ): Promise<{ id: string }> {
    return this.diaryRepository.createDiary(params);
  }

  public async getDiary(
    id: string,
    searchTerm?: string
  ): Promise<NotFoundException | diaryParams.DiaryEntity> {
    const result = await this.diaryRepository.getDiary(id, searchTerm);

    if (result instanceof NotFoundException) {
      return result;
    }

    return result;
  }

  public async getDiariesByUser(
    userId: string,
    searchTerm?: string,
    page = 1,
    limit = 10
  ): Promise<{
    diaries: diaryParams.DiaryEntity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const offset = (page - 1) * limit;

    const [diaries, countResult] = await Promise.all([
      this.diaryRepository.getDiariesByUser(userId, searchTerm, limit, offset),
      this.diaryRepository.getDiariesByUserCount(userId, searchTerm),
    ]);

    const totalItems = countResult.total;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      diaries,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public async updateDiary(
    id: string,
    userId: string,
    params: Partial<diaryParams.DiaryEntity>
  ): Promise<NotFoundException | void> {
    const existingDiary = await this.diaryRepository.getDiary(id);

    if (existingDiary instanceof NotFoundException) {
      return existingDiary;
    }

    if (existingDiary.user_id !== userId) {
      return new NotFoundException('Diary not found or access denied');
    }

    await this.diaryRepository.updateDiary(id, params);
  }

  public async deleteDiary(
    id: string,
    userId: string
  ): Promise<NotFoundException | void> {
    // First verify the diary exists and belongs to the user
    const existingDiary = await this.diaryRepository.getDiary(id);

    if (existingDiary instanceof NotFoundException) {
      return existingDiary;
    }

    // Check if the diary belongs to the user
    if (existingDiary.user_id !== userId) {
      return new NotFoundException('Diary not found or access denied');
    }

    await this.diaryRepository.deleteDiary(id);
  }
}

const diaryServices = new DiaryServiceImpl(diaryRepository);

export default diaryServices;
