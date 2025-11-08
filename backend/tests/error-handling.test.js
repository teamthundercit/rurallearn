/**
 * Error Handling Verification Test Suite
 * Tests error scenarios, user-friendly messages, retry mechanisms, and graceful degradation
 * Requirements: 1.5, 2.3, 5.5
 */

import axios from 'axios';
import mongoose from 'mongoose';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;

describe('Error Handling Verification', () => {
  
  // Test 1: Authentication Error Handling (Requirement 1.5)
  describe('Authentication Errors', () => {
    test('should return 401 with user-friendly message for missing token', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/users/me`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('success', false);
        expect(error.response.data).toHaveProperty('error');
        expect(error.response.data.error).toHaveProperty('code');
        expect(error.response.data.error).toHaveProperty('message');
        expect(typeof error.response.data.error.message).toBe('string');
      }
    });

    test('should return 401 with user-friendly message for invalid token', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: 'Bearer invalid_token_12345' }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('success', false);
        expect(error.response.data.error).toHaveProperty('message');
        expect(error.response.data.error.message).toMatch(/token|unauthorized|invalid/i);
      }
    });

    test('should return 401 with user-friendly message for malformed token', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: 'InvalidFormat' }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('success', false);
      }
    });
  });

  // Test 2: Data Retrieval Error Handling (Requirement 2.3)
  describe('Dashboard Data Retrieval Errors', () => {
    test('should return 404 with user-friendly message for non-existent user', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping test - no TEST_AUTH_TOKEN provided');
        return;
      }

      // This test assumes the user exists, so we test with a non-existent lesson instead
      try {
        await axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
          headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('success', false);
        expect(error.response.data.error).toHaveProperty('message');
        expect(error.response.data.error.message).toMatch(/not found/i);
      }
    });

    test('should return user-friendly error for invalid lesson ID format', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping test - no TEST_AUTH_TOKEN provided');
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/api/lessons/invalid-id-format`, {
          headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBeGreaterThanOrEqual(400);
        expect(error.response.data).toHaveProperty('success', false);
        expect(error.response.data.error).toHaveProperty('message');
      }
    });
  });

  // Test 3: Input Validation Errors
  describe('Input Validation Errors', () => {
    test('should return 400 with validation errors for invalid query parameters', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping test - no TEST_AUTH_TOKEN provided');
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/api/lessons?difficulty=invalid&page=-1&limit=1000`, {
          headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('success', false);
        expect(error.response.data.error).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(error.response.data.error).toHaveProperty('details');
        expect(Array.isArray(error.response.data.error.details)).toBe(true);
      }
    });

    test('should return 400 with validation errors for invalid user profile update', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping test - no TEST_AUTH_TOKEN provided');
        return;
      }

      try {
        await axios.put(`${API_BASE_URL}/api/users/me`, 
          { 
            name: '', // Empty name
            avatar: 'not-a-valid-url'
          },
          { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
        );
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('success', false);
        expect(error.response.data.error).toHaveProperty('code', 'VALIDATION_ERROR');
        expect(error.response.data.error).toHaveProperty('details');
      }
    });

    test('should return 400 for invalid quiz submission format', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping test - no TEST_AUTH_TOKEN provided');
        return;
      }

      // Get a lesson first
      const lessonsResponse = await axios.get(`${API_BASE_URL}/api/lessons`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });

      if (lessonsResponse.data.data?.lessons?.length === 0) {
        console.log('No lessons available for test');
        return;
      }

      const lessonId = lessonsResponse.data.data.lessons[0]._id;

      try {
        await axios.post(
          `${API_BASE_URL}/api/progress/quiz/${lessonId}`,
          { answers: 'not-an-array' },
          { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
        );
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBeGreaterThanOrEqual(400);
        expect(error.response.data).toHaveProperty('success', false);
      }
    });
  });

  // Test 4: Network and Service Unavailability
  describe('Service Unavailability Handling', () => {
    test('should handle requests to non-existent endpoints gracefully', async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/nonexistent/endpoint`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('success', false);
        expect(error.response.data.error).toHaveProperty('code', 'NOT_FOUND');
        expect(error.response.data.error).toHaveProperty('message');
      }
    });

    test('should verify health check endpoint is accessible', async () => {
      const response = await axios.get(`${API_BASE_URL}/health`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'ok');
    });

    test('should verify database health check endpoint', async () => {
      const response = await axios.get(`${API_BASE_URL}/api/health/db`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('connected');
      expect(response.data).toHaveProperty('status');
    });
  });

  // Test 5: Error Response Format Consistency
  describe('Error Response Format', () => {
    test('all error responses should follow consistent format', async () => {
      const errorEndpoints = [
        { method: 'get', url: '/api/users/me', headers: {} },
        { method: 'get', url: '/api/lessons/invalid-id', headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } },
        { method: 'get', url: '/api/nonexistent', headers: {} }
      ];

      for (const endpoint of errorEndpoints) {
        try {
          if (!TEST_AUTH_TOKEN && endpoint.headers.Authorization) {
            continue;
          }
          
          await axios[endpoint.method](`${API_BASE_URL}${endpoint.url}`, { headers: endpoint.headers });
        } catch (error) {
          if (error.response) {
            // Verify consistent error format
            expect(error.response.data).toHaveProperty('success', false);
            expect(error.response.data).toHaveProperty('error');
            expect(error.response.data.error).toHaveProperty('code');
            expect(error.response.data.error).toHaveProperty('message');
            expect(typeof error.response.data.error.code).toBe('string');
            expect(typeof error.response.data.error.message).toBe('string');
          }
        }
      }
    });
  });

  // Test 6: Graceful Degradation
  describe('Graceful Degradation', () => {
    test('should handle AI service failures gracefully', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping test - no TEST_AUTH_TOKEN provided');
        return;
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/ai/recommendations`,
          {},
          { 
            headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` },
            timeout: 10000
          }
        );
        
        // If successful, verify response format
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('success');
      } catch (error) {
        // If AI service fails, should return appropriate error
        if (error.response) {
          expect(error.response.data).toHaveProperty('success', false);
          expect(error.response.data.error).toHaveProperty('message');
        }
      }
    });

    test('should handle database connection issues in health check', async () => {
      const response = await axios.get(`${API_BASE_URL}/api/health/db`);
      
      // Should always return a response, even if DB is down
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.data).toHaveProperty('connected');
      expect(response.data).toHaveProperty('status');
      
      if (!response.data.connected) {
        expect(response.data.status).toMatch(/disconnected|error/i);
      }
    });
  });

  // Test 7: Retry Mechanism Verification
  describe('Retry Mechanisms', () => {
    test('should allow retry after authentication failure', async () => {
      // First attempt with invalid token
      try {
        await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: 'Bearer invalid_token' }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }

      // Second attempt should also work (no rate limiting on auth failures)
      try {
        await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: 'Bearer invalid_token_2' }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should handle multiple failed requests without blocking', async () => {
      const requests = [];
      
      for (let i = 0; i < 3; i++) {
        requests.push(
          axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
            headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
          }).catch(err => err.response)
        );
      }

      const responses = await Promise.all(requests);
      
      // All requests should fail with 404 or 401, but none should be blocked
      responses.forEach(response => {
        if (response) {
          expect([401, 404]).toContain(response.status);
        }
      });
    });
  });

  // Test 8: User-Friendly Error Messages
  describe('User-Friendly Error Messages', () => {
    test('error messages should be clear and actionable', async () => {
      const testCases = [
        {
          request: () => axios.get(`${API_BASE_URL}/api/users/me`),
          expectedMessagePattern: /authentication|token|unauthorized|login/i
        },
        {
          request: () => axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
            headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
          }),
          expectedMessagePattern: /not found|does not exist/i
        }
      ];

      for (const testCase of testCases) {
        try {
          if (!TEST_AUTH_TOKEN && testCase.request.toString().includes('TEST_AUTH_TOKEN')) {
            continue;
          }
          
          await testCase.request();
          fail('Should have thrown an error');
        } catch (error) {
          if (error.response) {
            expect(error.response.data.error.message).toMatch(testCase.expectedMessagePattern);
            // Message should not contain technical jargon or stack traces
            expect(error.response.data.error.message).not.toMatch(/stack|trace|undefined|null/i);
          }
        }
      }
    });

    test('validation errors should provide specific field-level feedback', async () => {
      if (!TEST_AUTH_TOKEN) {
        console.log('Skipping test - no TEST_AUTH_TOKEN provided');
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/api/lessons?difficulty=invalid&page=abc`, {
          headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toHaveProperty('details');
        expect(Array.isArray(error.response.data.error.details)).toBe(true);
        expect(error.response.data.error.details.length).toBeGreaterThan(0);
        
        // Each detail should be a clear message
        error.response.data.error.details.forEach(detail => {
          expect(typeof detail).toBe('string');
          expect(detail.length).toBeGreaterThan(0);
        });
      }
    });
  });
});
