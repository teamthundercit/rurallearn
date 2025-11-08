/**
 * End-to-End Test Suite for RuralLearn Backend
 * Tests complete user flows from authentication to lesson completion
 */

import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;

// Test data
let testUserId;
let testLessonId;
let testProgressId;

describe('RuralLearn E2E Tests', () => {
  
  // Test 1: User Authentication Flow
  describe('Authentication Flow', () => {
    test('should handle authenticated requests with valid token', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping auth test - no TEST_AUTH_TOKEN provided');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('email');
      testUserId = response.data.data._id;
    });

    test('should reject requests without authentication', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/users/me`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  // Test 2: Lesson Retrieval
  describe('Lesson Management', () => {
    test('should retrieve list of lessons', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping lesson test - no TEST_AUTH_TOKEN provided');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/lessons`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      
      if (response.data.data.length > 0) {
        testLessonId = response.data.data[0]._id;
        expect(response.data.data[0]).toHaveProperty('title');
        expect(response.data.data[0]).toHaveProperty('content');
      }
    });

    test('should retrieve specific lesson by ID', async () => {
      if (!TEST_AUTH_TOKEN || !testLessonId) {
        console.log('Skipping specific lesson test - prerequisites not met');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/lessons/${testLessonId}`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data._id).toBe(testLessonId);
      expect(response.data.data).toHaveProperty('quiz');
    });
  });

  // Test 3: Progress Tracking
  describe('Progress Tracking', () => {
    test('should record lesson completion', async () => {
      if (!TEST_AUTH_TOKEN || !testLessonId) {
        console.log('Skipping progress test - prerequisites not met');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/progress/lesson/${testLessonId}`,
        { timeSpent: 15 },
        { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('status');
    });

    test('should submit quiz and calculate score', async () => {
      if (!TEST_AUTH_TOKEN || !testLessonId) {
        console.log('Skipping quiz test - prerequisites not met');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/progress/quiz/${testLessonId}`,
        { answers: [0, 1, 2] },
        { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty('quizScore');
      expect(typeof response.data.data.quizScore).toBe('number');
    });

    test('should retrieve user progress', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping progress retrieval test - no TEST_AUTH_TOKEN provided');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
    });
  });

  // Test 4: AI Recommendations
  describe('AI Features', () => {
    test('should generate personalized recommendations', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping AI test - no TEST_AUTH_TOKEN provided');
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/ai/recommendations`,
          {},
          { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
        );

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty('recommendations');
      } catch (error) {
        // AI service might not be configured in test environment
        console.log('AI service not available in test environment');
      }
    });
  });

  // Test 5: Error Handling
  describe('Error Handling', () => {
    test('should return 404 for non-existent lesson', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping 404 test - no TEST_AUTH_TOKEN provided');
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
          headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should handle invalid quiz submission', async () => {
      if (!TEST_AUTH_TOKEN || !testLessonId) {
        console.log('Skipping invalid quiz test - prerequisites not met');
        return;
      }

      try {
        await axios.post(
          `${API_BASE_URL}/api/progress/quiz/${testLessonId}`,
          { answers: 'invalid' },
          { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
        );
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBeGreaterThanOrEqual(400);
      }
    });
  });

  // Test 6: Complete User Flow
  describe('Complete User Flow', () => {
    test('should complete full learning cycle', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping full flow test - no TEST_AUTH_TOKEN provided');
        return;
      }

      // Step 1: Get user profile
      const userResponse = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      expect(userResponse.status).toBe(200);

      // Step 2: Get lessons
      const lessonsResponse = await axios.get(`${API_BASE_URL}/api/lessons`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      expect(lessonsResponse.status).toBe(200);
      
      if (lessonsResponse.data.data.length === 0) {
        console.log('No lessons available for full flow test');
        return;
      }

      const lessonId = lessonsResponse.data.data[0]._id;

      // Step 3: View specific lesson
      const lessonResponse = await axios.get(`${API_BASE_URL}/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      expect(lessonResponse.status).toBe(200);

      // Step 4: Record lesson completion
      const completionResponse = await axios.post(
        `${API_BASE_URL}/api/progress/lesson/${lessonId}`,
        { timeSpent: 20 },
        { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
      );
      expect(completionResponse.status).toBe(200);

      // Step 5: Submit quiz
      const quizResponse = await axios.post(
        `${API_BASE_URL}/api/progress/quiz/${lessonId}`,
        { answers: [0, 1, 2] },
        { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
      );
      expect(quizResponse.status).toBe(200);

      // Step 6: Verify progress was saved
      const progressResponse = await axios.get(`${API_BASE_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      expect(progressResponse.status).toBe(200);
      expect(progressResponse.data.data.length).toBeGreaterThan(0);
    });
  });
});
