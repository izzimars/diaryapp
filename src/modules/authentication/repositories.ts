import { NotFoundException } from '../../shared/errors';
import { db } from '../../config/database';
import * as userParams from './entities';
import userQueries from './query';

export interface UserRepository {
  createUser(params: userParams.CreateUserEntity): Promise<userParams.UserEntity> ;
  getUser(
    identifier: string
  ): Promise<userParams.UserEntity | NotFoundException>;
  getUsers(
    searchTerm?: string,
    limit?: number,
    offset?: number
  ): Promise<userParams.UserEntity[]>;
  getUsersCount(searchTerm?: string): Promise<{ total: number }>;
  verifyUser(email: string): Promise<void>;
  updateOtp(email: string, otp: string, expiresAt: string): Promise<void>;
  updateUser(
    userId: string,
    updateData: Partial<userParams.CreateUserEntity>
  ): Promise<userParams.UserEntity | NotFoundException>;
  deleteUser(userId: string): Promise<void | NotFoundException>;
}

export class UserRepositoryImpl implements UserRepository {
  public async createUser(
    params: userParams.CreateUserEntity
  ): Promise<userParams.UserEntity> {
    return db.tx(async (t) => {
      const result = await t.one(userQueries.createUser, params);
      return new userParams.UserEntity({
        id: result.id,
        user_id: result.user_id,
        email: result.email,
        verified: result.verified,
        role: result.role,
        otp: result.otp,
        otp_expiry: result.otp_expiry,
        created_at: result.created_at,
        updated_at: result.updated_at,
      });
    });
  }

  public async getUser(
    identifier: string
  ): Promise<userParams.UserOtpEntity | NotFoundException> {
    const user = await db.oneOrNone(userQueries.getUser, [identifier]);

    if (!user) {
      return new NotFoundException('User not found');
    }

    return new userParams.UserOtpEntity({
      id: user.id,
      user_id: user.user_id,
      email: user.email,
      verified: user.verified,
      role: user.role,
      otp: user.otp,
      otp_expiry: user.otp_expiry,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }

  public async getUsers(
    searchTerm?: string,
    limit?: number,
    offset?: number
  ): Promise<userParams.UserEntity[]> {
    const users = await db.any(userQueries.getUsers, [
      searchTerm || null,
      limit || 10,
      offset || 0,
    ]);

    return users.map(
      (user: any) =>
        new userParams.UserEntity({
          id: user.id,
          user_id: user.user_id,
          email: user.email,
          verified: user.verified,
          role: user.role,
          otp: user.otp,
          otp_expiry: user.otp_expiry,
          created_at: user.created_at,
          updated_at: user.updated_at,
        })
    );
  }

  public async getUsersCount(searchTerm?: string): Promise<{ total: number }> {
    const result = await db.one(userQueries.getUsersCount, [
      searchTerm || null,
    ]);
    return { total: parseInt(result.total) };
  }

  public async verifyUser(email: string): Promise<void> {
    await db.none(userQueries.verifyUser, [email]);
  }

  public async updateOtp(
    email: string,
    otp: string,
    expiresAt: string
  ): Promise<void> {
    await db.none(userQueries.updateOtp, [otp, expiresAt, email]);
  }

  public async updateUser(
    userId: string,
    updateData: Partial<userParams.CreateUserEntity>
  ): Promise<userParams.UserEntity | NotFoundException> {
    const user = await db.oneOrNone(userQueries.getUser, [userId]);
    if (!user) {
      return new NotFoundException('User not found');
    }

    // Build update query dynamically based on provided data
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (updateData.email) {
      updateFields.push(`email = $${paramIndex++}`);
      updateValues.push(updateData.email);
    }
    if (updateData.verified !== undefined) {
      updateFields.push(`verified = $${paramIndex++}`);
      updateValues.push(updateData.verified);
    }
    if (updateData.role) {
      updateFields.push(`role = $${paramIndex++}`);
      updateValues.push(updateData.role);
    }

    updateFields.push(`updated_at = $${paramIndex++}`);
    updateValues.push(new Date().toISOString());
    updateValues.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const updatedUser = await db.one(updateQuery, updateValues);

    return new userParams.UserEntity({
      id: updatedUser.id,
      user_id: updatedUser.user_id,
      email: updatedUser.email,
      verified: updatedUser.verified,
      role: updatedUser.role,
      otp: updatedUser.otp,
      otp_expiry: updatedUser.otp_expiry,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    });
  }

  public async deleteUser(userId: string): Promise<void | NotFoundException> {
    const user = await db.oneOrNone(userQueries.getUser, [userId]);
    if (!user) {
      return new NotFoundException('User not found');
    }

    await db.none('DELETE FROM users WHERE id = $1', [userId]);
  }
}

const userRepository = new UserRepositoryImpl();

export default userRepository;
