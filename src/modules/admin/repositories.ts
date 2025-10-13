import { NotFoundException } from '../../shared/errors';
import { db } from '../../config/database';
import * as adminParams from './entities';
import adminQueries from './query';

export interface AdminRepository {
  createAdmin(
    params: adminParams.CreateAdminEntity
  ): Promise<adminParams.AdminEntity | NotFoundException>;
  getAdmin(
    identifier: string
  ): Promise<adminParams.AdminEntity | NotFoundException>;
  getAdmins(
    searchTerm?: string,
    limit?: number,
    offset?: number
  ): Promise<adminParams.AdminResponseEntity[]>;
  getAdminsCount(searchTerm?: string): Promise<{ total: number }>;
  updateAdmin(
    id: string,
    params: Partial<adminParams.AdminEntity>
  ): Promise<void>;
  deleteAdmin(id: string): Promise<void>;
  verifyAdmin(id: string): Promise<void>;
}

export class AdminRepositoryImpl implements AdminRepository {
  public async createAdmin(
    params: adminParams.CreateAdminEntity
  ): Promise<adminParams.AdminEntity | NotFoundException> {
    return db.tx(async (t) => {
      const result = await t.one(adminQueries.createAdmin, {
        email: params.email,
        password: params.password,
        verified: params.verified || false,
      });
      return { ...result };
    });
  }

  public async getAdmin(
    identifier: string
  ): Promise<adminParams.AdminEntity | NotFoundException> {
    const admin = await db.oneOrNone(adminQueries.getAdmin, [identifier]);

    if (!admin) {
      return new NotFoundException('Admin not found');
    }

    return new adminParams.AdminEntity({
      id: admin.id,
      email: admin.email,
      password: admin.password,
      verified: admin.verified,
      role: admin.role,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
    });
  }

  public async getAdmins(
    searchTerm?: string,
    limit?: number,
    offset?: number
  ): Promise<adminParams.AdminResponseEntity[]> {
    const admins = await db.any(adminQueries.getAdmins, [
      searchTerm || null,
      limit || 10,
      offset || 0,
    ]);

    return admins.map(
      (admin: any) =>
        new adminParams.AdminResponseEntity({
          id: admin.id,
          email: admin.email,
          verified: admin.verified,
          role: admin.role,
          created_at: admin.created_at,
          updated_at: admin.updated_at,
        })
    );
  }

  public async getAdminsCount(searchTerm?: string): Promise<{ total: number }> {
    const result = await db.one(adminQueries.getAdminsCount, [
      searchTerm || null,
    ]);
    return { total: parseInt(result.total) };
  }

  public async updateAdmin(
    id: string,
    params: Partial<adminParams.AdminEntity>
  ): Promise<void> {
    await db.none(adminQueries.updateAdmin, [
      id,
      params.email,
      params.password,
      params.verified,
    ]);
  }

  public async deleteAdmin(id: string): Promise<void> {
    await db.none(adminQueries.deleteAdmin, [id]);
  }

  public async verifyAdmin(id: string): Promise<void> {
    await db.none(adminQueries.verifyAdmin, [id]);
  }
}

const adminRepository = new AdminRepositoryImpl();

export default adminRepository;
