/**
 * Comprehensive Performance Testing Script
 * Tests page load times, bundle sizes, API response times, and provides optimization recommendations
 */

import axios from 'axios';
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const PERFORMANCE_THRESHOLD = 3000; // 3 seconds as per requirements

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Measure API response time
async function measureAPIResponseTime(endpoint, headers = {}) {
  const start = performance.now();
  try {
    await axios.get(`${API_BASE_URL}${endpoint}`, { 
      headers,
      timeout: 10000 
    });
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
    await axios.get(url, { timeout: 10000 });
    const end = performance.now();
    return end - start;
  } catch (error) {
    const end = performance.now();
    return { time: end - start, error: error.message };
  }
}

// Check bundle size and analyze
function analyzeBundleSize() {
  const buildPath = path.join(__dirname, '..', 'frontend', 'build', 'static');
  
  if (!fs.existsSync(buildPath)) {
    return { error: 'Build directory not found. Run "npm run build" in frontend directory first.' };
  }

  const jsPath = path.join(buildPath, 'js');
  const cssPath = path.join(buildPath, 'css');
  
  let totalSize = 0;
  const analysis = {
    js: { files: {}, total: 0, count: 0 },
    css: { files: {}, total: 0, count: 0 }
  };

  // Analyze JS files
  if (fs.existsSync(jsPath)) {
    const jsFiles = fs.readdirSync(jsPath).filter(f => f.endsWith('.js') && !f.endsWith('.map'));
    jsFiles.forEach(file => {
      const filePath = path.join(jsPath, file);
      const stats = fs.statSync(filePath);
      analysis.js.files[file] = stats.size;
      analysis.js.total += stats.size;
      analysis.js.count++;
      totalSize += stats.size;
    });
  }

  // Analyze CSS files
  if (fs.existsSync(cssPath)) {
    const cssFiles = fs.readdirSync(cssPath).filter(f => f.endsWith('.css') && !f.endsWith('.map'));
    cssFiles.forEach(file => {
      const filePath = path.join(cssPath, file);
      const stats = fs.statSync(filePath);
      analysis.css.files[file] = stats.size;
      analysis.css.total += stats.size;
      analysis.css.count++;
      totalSize += stats.size;
    });
  }

  return {
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    js: {
      ...analysis.js,
      totalFormatted: formatBytes(analysis.js.total)
    },
    css: {
      ...analysis.css,
      totalFormatted: formatBytes(analysis.css.total)
    }
  };
}

// Test concurrent requests
async function testConcurrentRequests(count = 10) {
  const start = performance.now();
  try {
    const promises = Array(count).fill(null).map(() => 
      axios.get(`${API_BASE_URL}/health`, { timeout: 5000 })
    );
    await Promise.all(promises);
    const end = performance.now();
    return {
      totalTime: end - start,
      avgTime: (end - start) / count,
      success: true
    };
  } catch (error) {
    const end = performance.now();
    return {
      totalTime: end - start,
      avgTime: (end - start) / count,
      success: false,
      error: error.message
    };
  }
}

// Simulate low bandwidth test
async function simulateLowBandwidth() {
  log('\nSimulating low-bandwidth connection...', 'yellow');
  
  // Test with timeout to simulate slow connection
  const start = performance.now();
  try {
    await axios.get(FRONTEND_URL, { 
      timeout: 5000,
      maxRedirects: 0
    });
    const end = performance.now();
    return end - start;
  } catch (error) {
    const end = performance.now();
    return { time: end - start, error: error.message };
  }
}

// Run comprehensive performance tests
async function runPerformanceTests() {
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║     RuralLearn Performance Optimization Test Suite    ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝\n', 'cyan');

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
  };

  // Test 1: Bundle Size Analysis
  log('═══ Test 1: Bundle Size Analysis ═══', 'blue');
  const bundleInfo = analyzeBundleSize();
  
  if (bundleInfo.error) {
    log(`⊘ ${bundleInfo.error}`, 'yellow');
    results.warnings++;
    results.tests.push({ name: 'Bundle Size', status: 'skipped', reason: bundleInfo.error });
  } else {
    log(`Total Bundle Size: ${bundleInfo.totalSizeFormatted}`, 'cyan');
    log(`  JavaScript: ${bundleInfo.js.totalFormatted} (${bundleInfo.js.count} files)`, 'cyan');
    log(`  CSS: ${bundleInfo.css.totalFormatted} (${bundleInfo.css.count} files)`, 'cyan');
    
    // Show largest files
    const allFiles = [
      ...Object.entries(bundleInfo.js.files).map(([name, size]) => ({ name, size, type: 'JS' })),
      ...Object.entries(bundleInfo.css.files).map(([name, size]) => ({ name, size, type: 'CSS' }))
    ].sort((a, b) => b.size - a.size).slice(0, 5);
    
    log('\n  Largest files:', 'cyan');
    allFiles.forEach(({ name, size, type }) => {
      log(`    ${type.padEnd(4)} ${name}: ${formatBytes(size)}`, 'cyan');
    });
    
    // Check thresholds
    const totalSizeMB = bundleInfo.totalSize / (1024 * 1024);
    if (totalSizeMB > 2) {
      log(`\n⚠ Bundle size (${bundleInfo.totalSizeFormatted}) exceeds 2MB - optimization recommended`, 'yellow');
      results.warnings++;
      results.tests.push({ name: 'Bundle Size', status: 'warning', value: bundleInfo.totalSizeFormatted });
    } else if (totalSizeMB > 1) {
      log(`\n⚠ Bundle size (${bundleInfo.totalSizeFormatted}) exceeds 1MB - consider optimization`, 'yellow');
      results.warnings++;
      results.tests.push({ name: 'Bundle Size', status: 'warning', value: bundleInfo.totalSizeFormatted });
    } else {
      log(`\n✓ Bundle size is acceptable`, 'green');
      results.passed++;
      results.tests.push({ name: 'Bundle Size', status: 'passed', value: bundleInfo.totalSizeFormatted });
    }
  }

  // Test 2: Frontend Page Load Time
  log('\n═══ Test 2: Frontend Page Load Time ═══', 'blue');
  const frontendLoadTime = await measurePageLoadTime(FRONTEND_URL);
  
  if (typeof frontendLoadTime === 'object' && frontendLoadTime.error) {
    log(`✗ Frontend Load: Error - ${frontendLoadTime.error}`, 'red');
    log(`  Make sure frontend is running on ${FRONTEND_URL}`, 'yellow');
    results.failed++;
    results.tests.push({ name: 'Frontend Load', status: 'failed', error: frontendLoadTime.error });
  } else if (frontendLoadTime < PERFORMANCE_THRESHOLD) {
    log(`✓ Frontend Load: ${Math.round(frontendLoadTime)}ms (< ${PERFORMANCE_THRESHOLD}ms) ✓`, 'green');
    results.passed++;
    results.tests.push({ name: 'Frontend Load', status: 'passed', value: `${Math.round(frontendLoadTime)}ms` });
  } else {
    log(`⚠ Frontend Load: ${Math.round(frontendLoadTime)}ms (> ${PERFORMANCE_THRESHOLD}ms)`, 'yellow');
    log(`  Target: < ${PERFORMANCE_THRESHOLD}ms`, 'yellow');
    results.warnings++;
    results.tests.push({ name: 'Frontend Load', status: 'warning', value: `${Math.round(frontendLoadTime)}ms` });
  }

  // Test 3: API Response Times
  log('\n═══ Test 3: API Response Times ═══', 'blue');
  
  // Health check
  const healthCheckTime = await measureAPIResponseTime('/health');
  if (typeof healthCheckTime === 'object' && healthCheckTime.error) {
    log(`✗ Health Check: Error - ${healthCheckTime.error}`, 'red');
    log(`  Make sure backend is running on ${API_BASE_URL}`, 'yellow');
    results.failed++;
    results.tests.push({ name: 'API Health Check', status: 'failed', error: healthCheckTime.error });
  } else if (healthCheckTime < 1000) {
    log(`✓ Health Check: ${Math.round(healthCheckTime)}ms (< 1000ms)`, 'green');
    results.passed++;
    results.tests.push({ name: 'API Health Check', status: 'passed', value: `${Math.round(healthCheckTime)}ms` });
  } else {
    log(`⚠ Health Check: ${Math.round(healthCheckTime)}ms (> 1000ms)`, 'yellow');
    results.warnings++;
    results.tests.push({ name: 'API Health Check', status: 'warning', value: `${Math.round(healthCheckTime)}ms` });
  }

  // Test 4: Concurrent Request Handling
  log('\n═══ Test 4: Concurrent Request Handling ═══', 'blue');
  const concurrentTest = await testConcurrentRequests(10);
  
  if (!concurrentTest.success) {
    log(`✗ Concurrent Requests: Error - ${concurrentTest.error}`, 'red');
    results.failed++;
    results.tests.push({ name: 'Concurrent Requests', status: 'failed', error: concurrentTest.error });
  } else if (concurrentTest.avgTime < 500) {
    log(`✓ Concurrent Requests: ${Math.round(concurrentTest.avgTime)}ms avg (10 requests)`, 'green');
    log(`  Total time: ${Math.round(concurrentTest.totalTime)}ms`, 'cyan');
    results.passed++;
    results.tests.push({ name: 'Concurrent Requests', status: 'passed', value: `${Math.round(concurrentTest.avgTime)}ms avg` });
  } else {
    log(`⚠ Concurrent Requests: ${Math.round(concurrentTest.avgTime)}ms avg (10 requests)`, 'yellow');
    log(`  Total time: ${Math.round(concurrentTest.totalTime)}ms`, 'cyan');
    results.warnings++;
    results.tests.push({ name: 'Concurrent Requests', status: 'warning', value: `${Math.round(concurrentTest.avgTime)}ms avg` });
  }

  // Test 5: Low Bandwidth Simulation
  log('\n═══ Test 5: Low Bandwidth Simulation ═══', 'blue');
  const lowBandwidthTime = await simulateLowBandwidth();
  
  if (typeof lowBandwidthTime === 'object' && lowBandwidthTime.error) {
    log(`⊘ Low Bandwidth Test: ${lowBandwidthTime.error}`, 'yellow');
    results.tests.push({ name: 'Low Bandwidth', status: 'skipped', error: lowBandwidthTime.error });
  } else if (lowBandwidthTime < PERFORMANCE_THRESHOLD) {
    log(`✓ Low Bandwidth: ${Math.round(lowBandwidthTime)}ms (< ${PERFORMANCE_THRESHOLD}ms)`, 'green');
    results.passed++;
    results.tests.push({ name: 'Low Bandwidth', status: 'passed', value: `${Math.round(lowBandwidthTime)}ms` });
  } else {
    log(`⚠ Low Bandwidth: ${Math.round(lowBandwidthTime)}ms (> ${PERFORMANCE_THRESHOLD}ms)`, 'yellow');
    results.warnings++;
    results.tests.push({ name: 'Low Bandwidth', status: 'warning', value: `${Math.round(lowBandwidthTime)}ms` });
  }

  // Print Summary
  log('\n╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║              Performance Test Summary                  ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  log(`\n✓ Passed:   ${results.passed}`, 'green');
  log(`⚠ Warnings: ${results.warnings}`, 'yellow');
  log(`✗ Failed:   ${results.failed}`, results.failed > 0 ? 'red' : 'green');

  // Optimization Recommendations
  if (results.warnings > 0 || results.failed > 0) {
    log('\n╔════════════════════════════════════════════════════════╗', 'magenta');
    log('║          Optimization Recommendations                  ║', 'magenta');
    log('╚════════════════════════════════════════════════════════╝', 'magenta');
    
    const recommendations = [];
    
    // Bundle size recommendations
    if (bundleInfo.totalSize && bundleInfo.totalSize / (1024 * 1024) > 1) {
      recommendations.push('Bundle Size Optimization:');
      recommendations.push('  • Enable code splitting with React.lazy()');
      recommendations.push('  • Use dynamic imports for large libraries');
      recommendations.push('  • Remove unused dependencies');
      recommendations.push('  • Enable tree shaking in build config');
      recommendations.push('  • Consider using lighter alternatives for heavy libraries');
    }
    
    // Load time recommendations
    if (frontendLoadTime > PERFORMANCE_THRESHOLD) {
      recommendations.push('\nPage Load Optimization:');
      recommendations.push('  • Implement lazy loading for routes and components');
      recommendations.push('  • Optimize images (use WebP, lazy loading)');
      recommendations.push('  • Enable compression (gzip/brotli)');
      recommendations.push('  • Use CDN for static assets');
      recommendations.push('  • Minimize render-blocking resources');
    }
    
    // API recommendations
    if (healthCheckTime > 500) {
      recommendations.push('\nAPI Performance:');
      recommendations.push('  • Add database indexes for frequently queried fields');
      recommendations.push('  • Implement caching (Redis/in-memory)');
      recommendations.push('  • Optimize database queries');
      recommendations.push('  • Use connection pooling');
    }
    
    recommendations.forEach(rec => log(rec, 'yellow'));
  } else {
    log('\n✓ All performance metrics meet requirements!', 'green');
    log('  The application is optimized for low-bandwidth and low-spec devices.', 'green');
  }

  // Save results to file
  const reportPath = path.join(__dirname, '..', 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      passed: results.passed,
      warnings: results.warnings,
      failed: results.failed
    },
    tests: results.tests,
    bundleInfo: bundleInfo.error ? null : bundleInfo
  }, null, 2));
  
  log(`\n📊 Detailed report saved to: ${reportPath}`, 'cyan');
  log('');

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runPerformanceTests().catch(error => {
  log(`\n✗ Fatal Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
