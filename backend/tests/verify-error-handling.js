/**
 * Error Handling Verification Script
 * Tests error scenarios, user-friendly messages, retry mechanisms, and graceful degradation
 * Requirements: 1.5, 2.3, 5.5
 * 
 * Run this script with: node tests/verify-error-handling.js
 * Make sure the backend server is running on the configured port
 */

import axios from 'axios';
import mongoose from 'mongoose';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTest(testName, passed, message = '') {
  if (passed) {
    passedTests++;
    log(`✓ ${testName}`, colors.green);
  } else {
    failedTests++;
    log(`✗ ${testName}`, colors.red);
    if (message) log(`  ${message}`, colors.red);
  }
}

function logSkip(testName, reason) {
  skippedTests++;
  log(`⊘ ${testName} - ${reason}`, colors.yellow);
}

async function runTests() {
  log('\n=== Error Handling Verification Tests ===\n', colors.cyan);
  
  // Test 1: Authentication Error Handling (Requirement 1.5)
  log('Test Suite: Authentication Errors', colors.blue);
  
  try {
    await axios.get(`${API_BASE_URL}/api/users/me`);
    logTest('Missing token returns 401', false, 'Expected 401 error');
  } catch (error) {
    const passed = error.response?.status === 401 &&
                   error.response?.data?.success === false &&
                   error.response?.data?.error?.code &&
                   error.response?.data?.error?.message;
    logTest('Missing token returns 401 with proper error format', passed);
  }
  
  try {
    await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: 'Bearer invalid_token_12345' }
    });
    logTest('Invalid token returns 401', false, 'Expected 401 error');
  } catch (error) {
    const message = error.response?.data?.error?.message || '';
    const passed = error.response?.status === 401 &&
                   error.response?.data?.success === false &&
                   /token|unauthorized|invalid|authentication/i.test(message);
    logTest('Invalid token returns 401 with user-friendly message', passed, 
            passed ? '' : `Got message: "${message}"`);
  }
  
  try {
    await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: 'InvalidFormat' }
    });
    logTest('Malformed token returns 401', false, 'Expected 401 error');
  } catch (error) {
    const passed = error.response?.status === 401 &&
                   error.response?.data?.success === false;
    logTest('Malformed token returns 401 with proper error format', passed);
  }
  
  // Test 2: Data Retrieval Error Handling (Requirement 2.3)
  log('\nTest Suite: Data Retrieval Errors', colors.blue);
  
  if (!TEST_AUTH_TOKEN) {
    logSkip('Non-existent lesson returns 404', 'No TEST_AUTH_TOKEN provided');
    logSkip('Invalid lesson ID format returns error', 'No TEST_AUTH_TOKEN provided');
  } else {
    try {
      await axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      logTest('Non-existent lesson returns 404', false, 'Expected 404 error');
    } catch (error) {
      const passed = error.response?.status === 404 &&
                     error.response?.data?.success === false &&
                     /not found/i.test(error.response?.data?.error?.message);
      logTest('Non-existent lesson returns 404 with user-friendly message', passed);
    }
    
    try {
      await axios.get(`${API_BASE_URL}/api/lessons/invalid-id-format`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      logTest('Invalid lesson ID format returns error', false, 'Expected error');
    } catch (error) {
      const passed = error.response?.status >= 400 &&
                     error.response?.data?.success === false &&
                     error.response?.data?.error?.message;
      logTest('Invalid lesson ID format returns proper error', passed);
    }
  }
  
  // Test 3: Input Validation Errors
  log('\nTest Suite: Input Validation Errors', colors.blue);
  
  if (!TEST_AUTH_TOKEN) {
    logSkip('Invalid query parameters return 400', 'No TEST_AUTH_TOKEN provided');
    logSkip('Invalid user profile update returns 400', 'No TEST_AUTH_TOKEN provided');
    logSkip('Invalid quiz submission returns 400', 'No TEST_AUTH_TOKEN provided');
  } else {
    try {
      await axios.get(`${API_BASE_URL}/api/lessons?difficulty=invalid&page=-1&limit=1000`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      logTest('Invalid query parameters return 400', false, 'Expected 400 error');
    } catch (error) {
      const passed = error.response?.status === 400 &&
                     error.response?.data?.success === false &&
                     error.response?.data?.error?.code === 'VALIDATION_ERROR' &&
                     Array.isArray(error.response?.data?.error?.details);
      logTest('Invalid query parameters return 400 with validation details', passed);
    }
    
    try {
      await axios.put(`${API_BASE_URL}/api/users/me`, 
        { 
          name: '', 
          avatar: 'not-a-valid-url'
        },
        { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
      );
      logTest('Invalid user profile update returns 400', false, 'Expected 400 error');
    } catch (error) {
      const passed = error.response?.status === 400 &&
                     error.response?.data?.success === false &&
                     error.response?.data?.error?.code === 'VALIDATION_ERROR' &&
                     error.response?.data?.error?.details;
      logTest('Invalid user profile update returns 400 with validation details', passed);
    }
    
    // Get a lesson first for quiz submission test
    try {
      const lessonsResponse = await axios.get(`${API_BASE_URL}/api/lessons`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
      
      if (lessonsResponse.data.data?.lessons?.length > 0) {
        const lessonId = lessonsResponse.data.data.lessons[0]._id;
        
        try {
          await axios.post(
            `${API_BASE_URL}/api/progress/quiz/${lessonId}`,
            { answers: 'not-an-array' },
            { headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` } }
          );
          logTest('Invalid quiz submission returns 400', false, 'Expected 400 error');
        } catch (error) {
          const passed = error.response?.status >= 400 &&
                         error.response?.data?.success === false;
          logTest('Invalid quiz submission returns proper error', passed);
        }
      } else {
        logSkip('Invalid quiz submission test', 'No lessons available');
      }
    } catch (error) {
      logSkip('Invalid quiz submission test', 'Could not fetch lessons');
    }
  }
  
  // Test 4: Service Unavailability Handling
  log('\nTest Suite: Service Unavailability Handling', colors.blue);
  
  try {
    await axios.get(`${API_BASE_URL}/api/nonexistent/endpoint`);
    logTest('Non-existent endpoint returns 404', false, 'Expected 404 error');
  } catch (error) {
    const passed = error.response?.status === 404 &&
                   error.response?.data?.success === false &&
                   error.response?.data?.error?.code === 'NOT_FOUND' &&
                   error.response?.data?.error?.message;
    logTest('Non-existent endpoint returns 404 with proper error format', passed);
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    const passed = response.status === 200 && response.data?.status === 'ok';
    logTest('Health check endpoint is accessible', passed);
  } catch (error) {
    logTest('Health check endpoint is accessible', false, error.message);
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health/db`);
    const passed = response.status === 200 &&
                   response.data?.hasOwnProperty('connected') &&
                   response.data?.hasOwnProperty('status');
    logTest('Database health check endpoint returns proper format', passed);
  } catch (error) {
    logTest('Database health check endpoint returns proper format', false, error.message);
  }
  
  // Test 5: Error Response Format Consistency
  log('\nTest Suite: Error Response Format Consistency', colors.blue);
  
  const errorEndpoints = [
    { method: 'get', url: '/api/users/me', headers: {}, name: 'Missing auth' },
    { method: 'get', url: '/api/nonexistent', headers: {}, name: 'Non-existent endpoint' }
  ];
  
  if (TEST_AUTH_TOKEN) {
    errorEndpoints.push({
      method: 'get',
      url: '/api/lessons/invalid-id',
      headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` },
      name: 'Invalid lesson ID'
    });
  }
  
  let allConsistent = true;
  for (const endpoint of errorEndpoints) {
    try {
      await axios[endpoint.method](`${API_BASE_URL}${endpoint.url}`, { headers: endpoint.headers });
    } catch (error) {
      if (error.response) {
        const hasConsistentFormat = 
          error.response.data?.success === false &&
          error.response.data?.error?.code &&
          error.response.data?.error?.message &&
          typeof error.response.data.error.code === 'string' &&
          typeof error.response.data.error.message === 'string';
        
        if (!hasConsistentFormat) {
          allConsistent = false;
          log(`  Inconsistent format for: ${endpoint.name}`, colors.red);
        }
      }
    }
  }
  logTest('All error responses follow consistent format', allConsistent);
  
  // Test 6: Graceful Degradation
  log('\nTest Suite: Graceful Degradation', colors.blue);
  
  if (!TEST_AUTH_TOKEN) {
    logSkip('AI service failure handling', 'No TEST_AUTH_TOKEN provided');
  } else {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/ai/recommendations`,
        {},
        { 
          headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` },
          timeout: 10000
        }
      );
      
      const passed = response.status === 200 && response.data?.hasOwnProperty('success');
      logTest('AI service handles requests gracefully', passed);
    } catch (error) {
      if (error.response) {
        const passed = error.response.data?.success === false &&
                       error.response.data?.error?.message;
        logTest('AI service returns proper error on failure', passed);
      } else {
        logTest('AI service handles requests gracefully', false, error.message);
      }
    }
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health/db`);
    const passed = response.status >= 200 &&
                   response.data?.hasOwnProperty('connected') &&
                   response.data?.hasOwnProperty('status');
    logTest('Database health check always returns response', passed);
  } catch (error) {
    logTest('Database health check always returns response', false, error.message);
  }
  
  // Test 7: Retry Mechanisms
  log('\nTest Suite: Retry Mechanisms', colors.blue);
  
  try {
    await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: 'Bearer invalid_token' }
    });
  } catch (error) {
    // First attempt should fail
  }
  
  try {
    await axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: 'Bearer invalid_token_2' }
    });
    logTest('Retry after authentication failure allowed', false, 'Expected 401 error');
  } catch (error) {
    const passed = error.response?.status === 401;
    logTest('Retry after authentication failure allowed (no rate limiting)', passed);
  }
  
  if (!TEST_AUTH_TOKEN) {
    logSkip('Multiple failed requests without blocking', 'No TEST_AUTH_TOKEN provided');
  } else {
    try {
      const requests = [];
      for (let i = 0; i < 3; i++) {
        requests.push(
          axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
            headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
          }).catch(err => err.response)
        );
      }
      
      const responses = await Promise.all(requests);
      const allFailed = responses.every(response => 
        response && [401, 404].includes(response.status)
      );
      logTest('Multiple failed requests handled without blocking', allFailed);
    } catch (error) {
      logTest('Multiple failed requests handled without blocking', false, error.message);
    }
  }
  
  // Test 8: User-Friendly Error Messages
  log('\nTest Suite: User-Friendly Error Messages', colors.blue);
  
  try {
    await axios.get(`${API_BASE_URL}/api/users/me`);
  } catch (error) {
    const message = error.response?.data?.error?.message || '';
    const passed = /authentication|token|unauthorized|login/i.test(message) &&
                   !/stack|trace|undefined|null/i.test(message);
    logTest('Authentication error message is clear and actionable', passed);
  }
  
  if (!TEST_AUTH_TOKEN) {
    logSkip('Not found error message is clear', 'No TEST_AUTH_TOKEN provided');
    logSkip('Validation errors provide field-level feedback', 'No TEST_AUTH_TOKEN provided');
  } else {
    try {
      await axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
    } catch (error) {
      const message = error.response?.data?.error?.message || '';
      const passed = /not found|does not exist/i.test(message) &&
                     !/stack|trace|undefined|null/i.test(message);
      logTest('Not found error message is clear and actionable', passed);
    }
    
    try {
      await axios.get(`${API_BASE_URL}/api/lessons?difficulty=invalid&page=abc`, {
        headers: { Authorization: `Bearer ${TEST_AUTH_TOKEN}` }
      });
    } catch (error) {
      const details = error.response?.data?.error?.details;
      const passed = error.response?.status === 400 &&
                     Array.isArray(details) &&
                     details.length > 0 &&
                     details.every(detail => typeof detail === 'string' && detail.length > 0);
      logTest('Validation errors provide specific field-level feedback', passed);
    }
  }
  
  // Summary
  log('\n=== Test Summary ===', colors.cyan);
  log(`Passed: ${passedTests}`, colors.green);
  log(`Failed: ${failedTests}`, colors.red);
  log(`Skipped: ${skippedTests}`, colors.yellow);
  log(`Total: ${passedTests + failedTests + skippedTests}\n`);
  
  if (failedTests > 0) {
    log('Some tests failed. Please review the error handling implementation.', colors.red);
    process.exit(1);
  } else if (skippedTests > 0) {
    log('All executed tests passed! Some tests were skipped due to missing TEST_AUTH_TOKEN.', colors.yellow);
    log('To run all tests, set TEST_AUTH_TOKEN environment variable with a valid Auth0 token.', colors.yellow);
  } else {
    log('All tests passed! Error handling is working correctly.', colors.green);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  log('Checking if server is running...', colors.cyan);
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log(`\nError: Server is not running at ${API_BASE_URL}`, colors.red);
    log('Please start the backend server first with: npm start', colors.yellow);
    process.exit(1);
  }
  
  log('Server is running. Starting tests...\n', colors.green);
  
  if (!TEST_AUTH_TOKEN) {
    log('Warning: TEST_AUTH_TOKEN not set. Some tests will be skipped.', colors.yellow);
    log('To run all tests, set TEST_AUTH_TOKEN environment variable.\n', colors.yellow);
  }
  
  await runTests();
})();
