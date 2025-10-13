import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { request, TestHelper, TestUser, TestAdmin } from './helpers';

describe('Diary API Tests', () => {
  let testUser: TestUser;
  let anotherUser: TestUser;
  let testAdmin: TestAdmin;
  let testDiaryId: string;

  before(async () => {
    console.log('Setting up test environment...');
  });

  describe('Authentication Setup', () => {
    it('should create and login as a regular user', async () => {
      testUser = await TestHelper.createAndLoginUser('testuser@example.com');
      
      expect(testUser.token).to.be.a('string');
      expect(testUser.userId).to.be.a('string');
      
      // Set runtime environment variable as requested
      process.env.USER_TOKEN = testUser.token;
    });

    it('should create and login as another user for ownership tests', async () => {
      anotherUser = await TestHelper.createAndLoginUser('anotheruser@example.com');
      
      expect(anotherUser.token).to.be.a('string');
      expect(anotherUser.userId).to.be.a('string');
    });

    it('should login as admin', async () => {
      testAdmin = await TestHelper.loginAdmin('admin@example.com', 'admin123');
      
      expect(testAdmin.token).to.be.a('string');
      
      // Set runtime environment variable as requested
      process.env.ADMIN_TOKEN = testAdmin.token;
    });
  });

  describe('POST /api/v1/diary - Create Diary', () => {
    it('should create a new diary entry with valid data', async () => {
      const diaryData = TestHelper.generateDiaryData('My First Diary Entry', 'This is a test diary entry describing my day.');

      const response = await request
        .post('/api/v1/diary')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send(diaryData)
        .expect(StatusCodes.CREATED);

      expect(response.body.status).to.equal('success');
      expect(response.body.statusCode).to.equal(StatusCodes.CREATED);
      expect(response.body.message).to.equal('Diary created successfully');
      expect(response.body.data).to.have.property('diary_id');
      expect(response.body.data.title).to.equal(diaryData.title);
      expect(response.body.data.description).to.equal(diaryData.description);
      expect(response.body.data.mood).to.equal(diaryData.mood);
      expect(response.body.data.weather).to.equal(diaryData.weather);
      expect(response.body.data.user_id).to.equal(testUser.userId);

      testDiaryId = response.body.data.diary_id;
    });

    it('should create diary with admin token', async () => {
      const diaryData = TestHelper.generateDiaryData('Admin Diary Entry', 'This is an admin diary entry.');

      const response = await request
        .post('/api/v1/diary')
        .set('Authorization', `Bearer ${testAdmin.token}`)
        .send(diaryData)
        .expect(StatusCodes.CREATED);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.title).to.equal(diaryData.title);
    });

    it('should fail to create diary without authentication', async () => {
      const diaryData = {
        title: 'Unauthorized Diary',
        description: 'This should fail',
        mood: 'sad',
        weather: 'rainy'
      };

      const response = await request
        .post('/api/v1/diary')
        .send(diaryData)
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to create diary with invalid data', async () => {
      const invalidData = {
        // Missing required title
        description: 'Missing title',
        mood: 'invalid_mood', // Invalid mood value
        weather: 'sunny'
      };

      const response = await request
        .post('/api/v1/diary')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to create diary with empty title', async () => {
      const invalidData = {
        title: '', // Empty title
        description: 'Empty title test',
        mood: 'happy',
        weather: 'sunny'
      };

      const response = await request
        .post('/api/v1/diary')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('GET /api/v1/diary/:id - Get Single Diary', () => {
    it('should get diary by ID for owner', async () => {
      const response = await request
        .get(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.statusCode).to.equal(StatusCodes.OK);
      expect(response.body.message).to.equal('Diary retrieved successfully');
      expect(response.body.data.diary_id).to.equal(testDiaryId);
      expect(response.body.data.user_id).to.equal(testUserId);
      expect(response.body.data.title).to.equal('My First Diary Entry');
    });

    it('should get diary by ID for admin', async () => {
      const response = await request
        .get(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.diary_id).to.equal(testDiaryId);
    });

    it('should get diary with search query', async () => {
      const response = await request
        .get(`/api/v1/diary/${testDiaryId}`)
        .query({ search: 'First' })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.diary_id).to.equal(testDiaryId);
    });

    it('should fail to get diary without authentication', async () => {
      const response = await request
        .get(`/api/v1/diary/${testDiaryId}`)
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to get diary for non-owner user', async () => {
      const response = await request
        .get(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .expect(StatusCodes.FORBIDDEN);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to get non-existent diary', async () => {
      const nonExistentId = 'diary-nonexistent12345678901234567890';
      
      const response = await request
        .get(`/api/v1/diary/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body.status).to.equal('error');
    });

    it('should fail with invalid diary ID format', async () => {
      const invalidId = 'invalid-id';
      
      const response = await request
        .get(`/api/v1/diary/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('GET /api/v1/diary - Get User Diaries', () => {
    before(async () => {
      // Create additional diary entries for pagination testing
      const additionalEntries = [
        {
          title: 'Second Diary Entry',
          description: 'Another test entry',
          mood: 'excited',
          weather: 'cloudy'
        },
        {
          title: 'Third Diary Entry',
          description: 'Yet another test entry',
          mood: 'calm',
          weather: 'rainy'
        }
      ];

      for (const entry of additionalEntries) {
        await request
          .post('/api/v1/diary')
          .set('Authorization', `Bearer ${userToken}`)
          .send(entry);
      }
    });

    it('should get all diaries for authenticated user', async () => {
      const response = await request
        .get('/api/v1/diary')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
      
      // Verify all entries belong to the authenticated user
      response.body.data.forEach((diary: any) => {
        expect(diary.user_id).to.equal(testUserId);
      });
    });

    it('should get diaries with pagination', async () => {
      const response = await request
        .get('/api/v1/diary')
        .query({ page: 1, limit: 2 })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.at.most(2);
    });

    it('should get diaries with search filter', async () => {
      const response = await request
        .get('/api/v1/diary')
        .query({ search: 'First' })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.be.an('array');
      
      // Check if search is working (at least one result should contain 'First')
      if (response.body.data.length > 0) {
        const hasMatchingResult = response.body.data.some((diary: any) => 
          diary.title.includes('First') || diary.description.includes('First')
        );
        expect(hasMatchingResult).to.be.true;
      }
    });

    it('should get diaries with mood filter', async () => {
      const response = await request
        .get('/api/v1/diary')
        .query({ mood: 'happy' })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.be.an('array');
      
      // Check if mood filter is working
      response.body.data.forEach((diary: any) => {
        expect(diary.mood).to.equal('happy');
      });
    });

    it('should get diaries with weather filter', async () => {
      const response = await request
        .get('/api/v1/diary')
        .query({ weather: 'sunny' })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.be.an('array');
      
      // Check if weather filter is working
      response.body.data.forEach((diary: any) => {
        expect(diary.weather).to.equal('sunny');
      });
    });

    it('should fail to get diaries without authentication', async () => {
      const response = await request
        .get('/api/v1/diary')
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body.status).to.equal('error');
    });

    it('should return empty array for user with no diaries', async () => {
      const response = await request
        .get('/api/v1/diary')
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.equal(0);
    });
  });

  describe('PUT /api/v1/diary/:id - Update Diary', () => {
    it('should update diary with valid data for owner', async () => {
      const updateData = {
        title: 'Updated Diary Title',
        description: 'Updated description for the diary entry',
        mood: 'excited',
        weather: 'partly_cloudy'
      };

      const response = await request
        .put(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.diary_id).to.equal(testDiaryId);
      expect(response.body.data.title).to.equal(updateData.title);
      expect(response.body.data.description).to.equal(updateData.description);
      expect(response.body.data.mood).to.equal(updateData.mood);
      expect(response.body.data.weather).to.equal(updateData.weather);
    });

    it('should update diary as admin', async () => {
      const updateData = {
        title: 'Admin Updated Title',
        description: 'Admin updated description'
      };

      const response = await request
        .put(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.title).to.equal(updateData.title);
    });

    it('should partially update diary (only title)', async () => {
      const updateData = {
        title: 'Partially Updated Title'
      };

      const response = await request
        .put(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data.title).to.equal(updateData.title);
    });

    it('should fail to update diary without authentication', async () => {
      const updateData = {
        title: 'Unauthorized Update'
      };

      const response = await request
        .put(`/api/v1/diary/${testDiaryId}`)
        .send(updateData)
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to update diary for non-owner', async () => {
      const updateData = {
        title: 'Non-owner Update'
      };

      const response = await request
        .put(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .send(updateData)
        .expect(StatusCodes.FORBIDDEN);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to update non-existent diary', async () => {
      const nonExistentId = 'diary-nonexistent12345678901234567890';
      const updateData = {
        title: 'Update Non-existent'
      };

      const response = await request
        .put(`/api/v1/diary/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body.status).to.equal('error');
    });

    it('should fail with invalid diary ID format', async () => {
      const invalidId = 'invalid-id';
      const updateData = {
        title: 'Invalid ID Update'
      };

      const response = await request
        .put(`/api/v1/diary/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });

    it('should fail with invalid update data', async () => {
      const invalidData = {
        mood: 'invalid_mood_value',
        weather: 'invalid_weather_value'
      };

      const response = await request
        .put(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('DELETE /api/v1/diary/:id - Delete Diary', () => {
    let diaryToDeleteId: string;

    before(async () => {
      // Create a diary entry specifically for deletion testing
      const diaryData = {
        title: 'Diary to Delete',
        description: 'This diary will be deleted in tests',
        mood: 'neutral',
        weather: 'cloudy'
      };

      const response = await request
        .post('/api/v1/diary')
        .set('Authorization', `Bearer ${userToken}`)
        .send(diaryData);

      diaryToDeleteId = response.body.data.diary_id;
    });

    it('should delete diary for owner', async () => {
      const response = await request
        .delete(`/api/v1/diary/${diaryToDeleteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.include('deleted');
    });

    it('should delete diary as admin', async () => {
      // Create another diary to delete as admin
      const diaryData = {
        title: 'Admin Delete Test',
        description: 'Admin will delete this',
        mood: 'happy',
        weather: 'sunny'
      };

      const createResponse = await request
        .post('/api/v1/diary')
        .set('Authorization', `Bearer ${userToken}`)
        .send(diaryData);

      const diaryId = createResponse.body.data.diary_id;

      const response = await request
        .delete(`/api/v1/diary/${diaryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
    });

    it('should fail to delete diary without authentication', async () => {
      const response = await request
        .delete(`/api/v1/diary/${testDiaryId}`)
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to delete diary for non-owner', async () => {
      const response = await request
        .delete(`/api/v1/diary/${testDiaryId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .expect(StatusCodes.FORBIDDEN);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to delete non-existent diary', async () => {
      const nonExistentId = 'diary-nonexistent12345678901234567890';

      const response = await request
        .delete(`/api/v1/diary/${nonExistentId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body.status).to.equal('error');
    });

    it('should fail with invalid diary ID format', async () => {
      const invalidId = 'invalid-id';

      const response = await request
        .delete(`/api/v1/diary/${invalidId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });

    it('should fail to delete already deleted diary', async () => {
      const response = await request
        .delete(`/api/v1/diary/${diaryToDeleteId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed authorization header', async () => {
      const response = await request
        .get('/api/v1/diary')
        .set('Authorization', 'InvalidToken')
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body.status).to.equal('error');
    });

    it('should handle expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      const response = await request
        .get('/api/v1/diary')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(StatusCodes.UNAUTHORIZED);

      expect(response.body.status).to.equal('error');
    });

    it('should handle very long title gracefully', async () => {
      const longTitle = 'a'.repeat(1000); // Very long title
      const diaryData = {
        title: longTitle,
        description: 'Testing very long title',
        mood: 'happy',
        weather: 'sunny'
      };

      const response = await request
        .post('/api/v1/diary')
        .set('Authorization', `Bearer ${userToken}`)
        .send(diaryData)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });

    it('should handle special characters in search', async () => {
      const response = await request
        .get('/api/v1/diary')
        .query({ search: '!@#$%^&*()' })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.OK);

      expect(response.body.status).to.equal('success');
      expect(response.body.data).to.be.an('array');
    });

    it('should handle negative pagination values', async () => {
      const response = await request
        .get('/api/v1/diary')
        .query({ page: -1, limit: -5 })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });

    it('should handle zero pagination values', async () => {
      const response = await request
        .get('/api/v1/diary')
        .query({ page: 0, limit: 0 })
        .set('Authorization', `Bearer ${userToken}`)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body.status).to.equal('error');
    });
  });

  describe('Performance and Load Tests', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = [];
      const concurrentRequests = 10;

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          request
            .get('/api/v1/diary')
            .set('Authorization', `Bearer ${userToken}`)
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).to.equal(StatusCodes.OK);
        expect(response.body.status).to.equal('success');
      });
    });

    it('should handle batch diary creation', async () => {
      const batchSize = 5;
      const promises = [];

      for (let i = 0; i < batchSize; i++) {
        const diaryData = {
          title: `Batch Diary ${i + 1}`,
          description: `Batch created diary entry number ${i + 1}`,
          mood: 'happy',
          weather: 'sunny'
        };

        promises.push(
          request
            .post('/api/v1/diary')
            .set('Authorization', `Bearer ${userToken}`)
            .send(diaryData)
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach((response, index) => {
        expect(response.status).to.equal(StatusCodes.CREATED);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.title).to.equal(`Batch Diary ${index + 1}`);
      });
    });
  });

  after(async () => {
    // Cleanup: Remove test environment variables
    delete process.env.USER_TOKEN;
    delete process.env.ADMIN_TOKEN;
    
    console.log('Test cleanup completed');
  });
});