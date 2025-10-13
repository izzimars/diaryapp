import supertest from 'supertest';
import app from '../src/config/express';
import { StatusCodes } from 'http-status-codes';

export const request = supertest(app);

export interface TestUser {
  email: string;
  token?: string;
  userId?: string;
}

export interface TestAdmin {
  email: string;
  password: string;
  token?: string;
}

export class TestHelper {
  static async createAndLoginUser(email: string): Promise<TestUser> {
    // Login user
    const loginResponse = await request
      .post('/api/v1/auth/login')
      .send({ email })
      .expect(StatusCodes.OK);

    const userId = loginResponse.body.data.user_id;

    // Verify OTP
    const verifyResponse = await request
      .post('/api/v1/auth/verify-otp')
      .send({
        email,
        otp: process.env.TEST_OTP || '123456'
      })
      .expect(StatusCodes.OK);

    return {
      email,
      token: verifyResponse.body.data.token,
      userId
    };
  }

  static async loginAdmin(email: string, password: string): Promise<TestAdmin> {
    const adminLoginResponse = await request
      .post('/api/v1/admin/login')
      .send({
        email,
        password
      })
      .expect(StatusCodes.OK);

    return {
      email,
      password,
      token: adminLoginResponse.body.data.token
    };
  }

  static async createDiary(token: string, diaryData: any) {
    const response = await request
      .post('/api/v1/diary')
      .set('Authorization', `Bearer ${token}`)
      .send(diaryData)
      .expect(StatusCodes.CREATED);

    return response.body.data;
  }

  static generateDiaryData(title?: string, description?: string) {
    return {
      title: title || `Test Diary ${Date.now()}`,
      description: description || `Test description ${Date.now()}`,
      mood: 'happy',
      weather: 'sunny'
    };
  }

  static validateDiaryResponse(response: any, expectedData: any) {
    return {
      hasValidStructure: response.body.status === 'success' && 
                        response.body.data && 
                        response.body.data.diary_id,
      matchesExpectedData: response.body.data.title === expectedData.title &&
                          response.body.data.description === expectedData.description
    };
  }
}

export default TestHelper;