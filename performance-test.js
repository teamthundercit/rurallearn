/**
 * Performance Testing Script
 * Tests page load times, bundle sizes, and performance metrics
 */

import axios from 'axios';
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const PERFORMANCE_THRESHOLD = 3000; // 3 seconds as per requirements

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

// Measure API response time
async function measureAPIResponseTime(endpoint, headers = {}) {
  const start = performance.now();
  try {
    await axios.get(`${API_BASE_URL}${endpoint}`, { headers });
    const end = performance.now();
    return end - start;
  } catch (error) {
    const end = performance.now();
    return { time: end - start, error: error.message };
  }
}

// Measure page load time
async function measurePageLoadTime(url) {
  const start = performance.now();
  try {
    await axios.get(url);
    const end = performance.now();
    return end - start;
  } catch (error) {
    const end = performance.now();
    return { time: end - start, error: error.message };
  }
}

// Check bundle size
function checkBundleSize() {
  const buildPath = path.join(process.cwd(), 'frontend', 'build', 'static', 'js');
  
  if (!fs.existsSync(buildPath)) {
    return { error: 'Build directory not found. Run npm run build first.' };
  }

  const files = fs.readdirSync(buildPath);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  let totalSize = 0;
  const fileSizes = {};

  jsFiles.forEach(file => {
    const filePath = path.join(buildPath, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    fileSizes[file] = sizeKB;
    totalSize += stats.size;
  });

  return {
    totalSizeKB: (totalSize / 1024).toFixed(2),
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    files: fileSizes,
    fileCount: jsFiles.length
  };
}

// Run performance tests
async function runPerformanceTests() {
  log('\n=== RuralLearn Performance Test Suite ===\n', 'blue');

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Test 1: Frontend page load time
  log('Testing Frontend Page Load Time...', 'yellow');
  const frontendLoadTime = await measurePageLoadTime(FRONTEND_URL);
  
  if (typeof frontendLoadTime === 'object' && frontendLoadTime.error) {
    log(`✗ Frontend Load: Error - ${frontendLoadTime.error}`, 'red');
    results.failed++;
  } else if (frontendLoadTime < PERFORMANCE_THRESHOLD) {
    log(`✓ Frontend Load: ${frontendLoadTime.toFixed(0)}ms (< ${PERFORMANCE_THRESHOLD}ms)`, 'green');
    results.passed++;
  } else {
    log(`⚠ Frontend Load: ${frontendLoadTime.toFixed(0)}ms (> ${PERFORMANCE_THRESHOLD}ms)`, 'yellow');
    results.warnings++;
  }

  // Test 2: API health check response time
  log('\nTesting API Response Times...', 'yellow');
  const healthCheckTime = await measureAPIResponseTime('/health');
  
  if (typeof healthCheckTime === 'object' && healthCheckTime.error) {
    log(`✗ Health Check: Error - ${healthCheckTime.error}`, 'red');
    results.failed++;
  } else if (healthCheckTime < 1000) {
    log(`✓ Health Check: ${healthCheckTime.toFixed(0)}ms (< 1000ms)`, 'green');
    results.passed++;
  } else {
    log(`⚠ Health Check: ${healthCheckTime.toFixed(0)}ms (> 1000ms)`, 'yellow');
    results.warnings++;
  }

  // Test 3: Lessons API response time
  const token = process.env.TEST_AUTH_TOKEN;
  if (token) {
    const lessonsTime = await measureAPIResponseTime('/api/lessons', {
      Authorization: `Bearer ${token}`
    });
    
    if (typeof lessonsTime === 'object' && lessonsTime.error) {
      log(`✗ Lessons API: Error - ${lessonsTime.error}`, 'red');
      results.failed++;
    } else if (lessonsTime < 2000) {
      log(`✓ Lessons API: ${lessonsTime.toFixed(0)}ms (< 2000ms)`, 'green');
      results.passed++;
    } else {
      log(`⚠ Lessons API: ${lessonsTime.toFixed(0)}ms (> 2000ms)`, 'yellow');
      results.warnings++;
    }
  } else {
    log('⊘ Lessons API: Skipped (no TEST_AUTH_TOKEN)', 'yellow');
  }

  // Test 4: Bundle size analysis
  log('\nAnalyzing Bundle Size...', 'yellow');
  const bundleInfo = checkBundleSize();
  
  if (bundleInfo.error) {
    log(`⊘ Bundle Size: ${bundleInfo.error}`, 'yellow');
  } else {
    log(`Bundle Size: ${bundleInfo.totalSizeKB} KB (${bundleInfo.totalSizeMB} MB)`, 'blue');
    log(`Number of JS files: ${bundleInfo.fileCount}`, 'blue');
    
    // Check if bundle is too large (> 1MB is a warning)
    if (parseFloat(bundleInfo.totalSizeMB) > 1) {
      log(`⚠ Bundle size exceeds 1MB - consider code splitting`, 'yellow');
      results.warnings++;
    } else {
      log(`✓ Bundle size is acceptable`, 'green');
      results.passed++;
    }

    // Show largest files
    const sortedFiles = Object.entries(bundleInfo.files)
      .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
      .slice(0, 3);
    
    log('\nLargest JS files:', 'blue');
    sortedFiles.forEach(([file, size]) => {
      log(`  - ${file}: ${size} KB`, 'blue');
    });
  }

  // Test 5: Multiple concurrent requests (load test)
  log('\nTesting Concurrent Request Handling...', 'yellow');
  const concurrentRequests = 10;
  const startTime = performance.now();
  
  try {
    const promises = Array(concurrentRequests).fill(null).map(() => 
      axios.get(`${API_BASE_URL}/health`)
    );
    await Promise.all(promises);
    const endTime = performance.now();
    const avgTime = (endTime - startTime) / concurrentRequests;
    
    if (avgTime < 500) {
      log(`✓ Concurrent Requests: ${avgTime.toFixed(0)}ms avg (${concurrentRequests} requests)`, 'green');
      results.passed++;
    } else {
      log(`⚠ Concurrent Requests: ${avgTime.toFixed(0)}ms avg (${concurrentRequests} requests)`, 'yellow');
      results.warnings++;
    }
  } catch (error) {
    log(`✗ Concurrent Requests: Error - ${error.message}`, 'red');
    results.failed++;
  }

  // Print summary
  log('\n=== Performance Test Summary ===', 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Warnings: ${results.warnings}`, 'yellow');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');

  // Recommendations
  if (results.warnings > 0 || results.failed > 0) {
    log('\n=== Optimization Recommendations ===', 'yellow');
    
    if (frontendLoadTime > PERFORMANCE_THRESHOLD) {
      log('• Implement code splitting for routes', 'yellow');
      log('• Enable lazy loading for components', 'yellow');
      log('• Optimize images and assets', 'yellow');
    }
    
    if (bundleInfo.totalSizeMB && parseFloat(bundleInfo.totalSizeMB) > 1) {
      log('• Consider removing unused dependencies', 'yellow');
      log('• Enable tree shaking in build config', 'yellow');
      log('• Use dynamic imports for large libraries', 'yellow');
    }
  } else {
    log('\n✓ All performance metrics are within acceptable ranges!', 'green');
  }

  log('');
  return results;
}

// Run tests
runPerformanceTests().catch(error => {
  log(`\nFatal Error: ${error.message}`, 'red');
  process.exit(1);
});
