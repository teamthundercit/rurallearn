/**
 * E2E Test Runner Script
 * Runs comprehensive end-to-end tests for RuralLearn platform
 */

import axios from 'axios';
import { spawn } from 'child_process';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

async function runTest(name, testFn) {
  results.total++;
  try {
    await testFn();
    results.passed++;
    log(`✓ ${name}`, 'green');
    return true;
  } catch (error) {
    results.failed++;
    log(`✗ ${name}`, 'red');
    log(`  Error: ${error.message}`, 'red');
    return false;
  }
}

// Health check tests
async function testBackendHealth() {
  const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
  if (response.status !== 200) {
    throw new Error('Backend health check failed');
  }
}

async function testFrontendHealth() {
  const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
  if (response.status !== 200) {
    throw new Error('Frontend health check failed');
  }
}

async function testDatabaseConnection() {
  const response = await axios.get(`${API_BASE_URL}/api/health/db`, { timeout: 5000 });
  if (response.status !== 200 || !response.data.connected) {
    throw new Error('Database connection failed');
  }
}

// API endpoint tests
async function testLessonsEndpoint() {
  const token = process.env.TEST_AUTH_TOKEN;
  if (!token) {
    throw new Error('TEST_AUTH_TOKEN not provided');
  }

  const response = await axios.get(`${API_BASE_URL}/api/lessons`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status !== 200 || !response.data.success) {
    throw new Error('Lessons endpoint failed');
  }

  if (!Array.isArray(response.data.data)) {
    throw new Error('Lessons endpoint did not return array');
  }
}

async function testUserEndpoint() {
  const token = process.env.TEST_AUTH_TOKEN;
  if (!token) {
    throw new Error('TEST_AUTH_TOKEN not provided');
  }

  const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status !== 200 || !response.data.success) {
    throw new Error('User endpoint failed');
  }

  if (!response.data.data.email) {
    throw new Error('User endpoint did not return email');
  }
}

async function testProgressEndpoint() {
  const token = process.env.TEST_AUTH_TOKEN;
  if (!token) {
    throw new Error('TEST_AUTH_TOKEN not provided');
  }

  const response = await axios.get(`${API_BASE_URL}/api/progress`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status !== 200 || !response.data.success) {
    throw new Error('Progress endpoint failed');
  }

  if (!Array.isArray(response.data.data)) {
    throw new Error('Progress endpoint did not return array');
  }
}

// Error handling tests
async function testAuthenticationError() {
  try {
    await axios.get(`${API_BASE_URL}/api/users/me`);
    throw new Error('Should have returned 401');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; // Expected error
    }
    throw error;
  }
}

async function test404Error() {
  const token = process.env.TEST_AUTH_TOKEN;
  if (!token) {
    throw new Error('TEST_AUTH_TOKEN not provided');
  }

  try {
    await axios.get(`${API_BASE_URL}/api/lessons/000000000000000000000000`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    throw new Error('Should have returned 404');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return; // Expected error
    }
    throw error;
  }
}

// Main test runner
async function runAllTests() {
  log('\n=== RuralLearn E2E Test Suite ===\n', 'blue');

  // Health checks
  log('Running Health Checks...', 'yellow');
  await runTest('Backend Health Check', testBackendHealth);
  await runTest('Frontend Health Check', testFrontendHealth);
  await runTest('Database Connection', testDatabaseConnection);

  log('\nRunning API Endpoint Tests...', 'yellow');
  await runTest('Lessons Endpoint', testLessonsEndpoint);
  await runTest('User Endpoint', testUserEndpoint);
  await runTest('Progress Endpoint', testProgressEndpoint);

  log('\nRunning Error Handling Tests...', 'yellow');
  await runTest('Authentication Error (401)', testAuthenticationError);
  await runTest('Not Found Error (404)', test404Error);

  // Print summary
  log('\n=== Test Summary ===', 'blue');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`, 
      results.failed > 0 ? 'yellow' : 'green');

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`\nFatal Error: ${error.message}`, 'red');
  process.exit(1);
});
