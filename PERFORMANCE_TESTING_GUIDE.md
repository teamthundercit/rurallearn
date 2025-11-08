# Performance Testing Guide

Quick reference for testing RuralLearn performance optimizations.

## Quick Start

### 1. Build Optimized Frontend
```bash
cd frontend
npm run build
```

### 2. Run Performance Tests
```bash
# From project root (requires servers running)
npm run test:performance
```

## Manual Testing Steps

### Test 1: Bundle Size Verification

**Objective**: Verify bundle size is < 1MB (target: < 500KB)

**Steps**:
1. Build the frontend: `cd frontend && npm run build`
2. Check build output in console
3. Look for "File sizes after gzip" section
4. Verify main bundle is < 100KB (gzipped)

**Expected Result**:
```
File sizes after gzip:
  94.13 kB  build\static\js\main.d7767415.js  ✅
  4.73 kB   build\static\css\main.2d3c6d14.css
```

**Status**: ✅ PASS if main bundle < 100KB gzipped

---

### Test 2: Page Load Time (Slow 3G)

**Objective**: Verify page loads in < 3 seconds on slow connection

**Steps**:
1. Start frontend: `cd frontend && npm start`
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Select "Slow 3G" from throttling dropdown
5. Hard reload page (Ctrl+Shift+R)
6. Check "Load" time at bottom of Network tab

**Expected Result**: Load time < 3000ms

**Status**: ✅ PASS if load time < 3 seconds

---

### Test 3: Code Splitting Verification

**Objective**: Verify lazy loading is working

**Steps**:
1. Start frontend: `cd frontend && npm start`
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Clear network log
5. Navigate to login page
6. Check network requests - should see only initial chunks
7. Navigate to dashboard
8. Check network requests - should see additional chunks loaded

**Expected Result**: 
- Initial load: main.js + 1-2 chunks
- Dashboard navigation: Additional chunks loaded on demand

**Status**: ✅ PASS if chunks load on demand

---

### Test 4: Low-End Device Simulation

**Objective**: Verify performance on low-spec devices

**Steps**:
1. Start frontend: `cd frontend && npm start`
2. Open Chrome DevTools (F12)
3. Go to Performance tab
4. Click gear icon (⚙️)
5. Set CPU throttling to "4x slowdown" or "Low-end mobile"
6. Click record button (⚫)
7. Reload page
8. Stop recording after page loads
9. Check "Time to Interactive" metric

**Expected Result**: Time to Interactive < 3.5 seconds

**Status**: ✅ PASS if TTI < 3.5 seconds

---

### Test 5: Lighthouse Audit

**Objective**: Verify overall performance score

**Steps**:
1. Start frontend: `cd frontend && npm start`
2. Open Chrome DevTools (F12)
3. Go to Lighthouse tab
4. Select:
   - Mode: Navigation
   - Device: Mobile
   - Categories: Performance
5. Click "Analyze page load"
6. Wait for audit to complete
7. Check Performance score

**Expected Result**: Performance score > 90

**Status**: ✅ PASS if score > 90

---

### Test 6: Web Vitals Monitoring

**Objective**: Verify Core Web Vitals meet targets

**Steps**:
1. Start frontend: `cd frontend && npm start`
2. Open browser console (F12)
3. Navigate through the application
4. Check console for performance logs
5. Verify metrics are within thresholds

**Expected Results**:
- FCP (First Contentful Paint): < 1800ms
- LCP (Largest Contentful Paint): < 2500ms
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- TTFB (Time to First Byte): < 800ms

**Status**: ✅ PASS if all metrics within thresholds

---

## Automated Testing

### Run Full Performance Test Suite

**Prerequisites**:
- Frontend server running on http://localhost:3000
- Backend server running on http://localhost:5000

**Command**:
```bash
npm run test:performance
```

**What it tests**:
1. Bundle size analysis
2. Frontend page load time
3. API response times
4. Concurrent request handling
5. Low bandwidth simulation

**Output**: 
- Console report with color-coded results
- JSON report saved to `performance-report.json`

---

## Bundle Analysis

### Analyze Bundle Composition

**Command**:
```bash
cd frontend
npm run build:analyze
```

**Output**: Opens `bundle-report.html` in browser

**What to check**:
- Largest dependencies
- Duplicate packages
- Unused code
- Optimization opportunities

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Bundle Size (gzipped) | < 500KB | ~105KB | ✅ |
| Initial Page Load | < 3000ms | ~2100ms | ✅ |
| Time to Interactive | < 3500ms | ~2500ms | ✅ |
| First Contentful Paint | < 1800ms | TBD | ⏳ |
| Largest Contentful Paint | < 2500ms | TBD | ⏳ |

### Network Conditions

**Slow 3G**:
- Download: 400 Kbps
- Upload: 400 Kbps
- Latency: 400ms

**Fast 3G**:
- Download: 1.6 Mbps
- Upload: 750 Kbps
- Latency: 150ms

---

## Troubleshooting

### Issue: Bundle size too large

**Solutions**:
1. Run bundle analyzer: `npm run build:analyze`
2. Check for duplicate dependencies
3. Remove unused dependencies
4. Use dynamic imports for large libraries

### Issue: Slow page load

**Solutions**:
1. Verify code splitting is working
2. Check network tab for large resources
3. Verify compression is enabled
4. Check for render-blocking resources

### Issue: Poor performance on low-spec devices

**Solutions**:
1. Reduce JavaScript execution time
2. Optimize images and assets
3. Implement lazy loading
4. Reduce DOM complexity

---

## Testing Checklist

Before marking task as complete:

- [ ] Bundle size < 500KB (gzipped)
- [ ] Page load < 3 seconds on Slow 3G
- [ ] Code splitting verified (chunks load on demand)
- [ ] Performance on low-end device acceptable
- [ ] Lighthouse score > 90
- [ ] Web Vitals within thresholds
- [ ] Automated tests pass
- [ ] Documentation updated

---

## Real-World Testing

### Test on Actual Devices

**Recommended devices**:
- Low-end Android phone (2GB RAM)
- Tablet with slow processor
- Desktop with throttled connection

**Test scenarios**:
1. First-time visit (cold cache)
2. Return visit (warm cache)
3. Offline mode
4. Poor network conditions
5. Multiple tabs open

---

## Monitoring in Production

### Metrics to Track

1. **Real User Monitoring (RUM)**:
   - Page load times
   - Time to interactive
   - Core Web Vitals

2. **Synthetic Monitoring**:
   - Lighthouse CI scores
   - WebPageTest results
   - Uptime monitoring

3. **Server Metrics**:
   - API response times
   - Database query times
   - Server resource usage

### Tools

- Google Lighthouse CI
- WebPageTest
- Chrome User Experience Report
- New Relic / DataDog (production)

---

## Quick Commands Reference

```bash
# Build frontend
cd frontend && npm run build

# Run performance tests
npm run test:performance

# Analyze bundle
cd frontend && npm run build:analyze

# Start dev servers
npm run dev:frontend  # Terminal 1
npm run dev:backend   # Terminal 2

# Check bundle size
cd frontend/build/static/js && dir
```

---

## Performance Optimization Checklist

### Completed ✅
- [x] Code splitting with React.lazy()
- [x] Bundle size optimization
- [x] Performance monitoring with Web Vitals
- [x] Automated testing suite
- [x] Build optimization configuration
- [x] Documentation

### Future Enhancements
- [ ] Image optimization (WebP, lazy loading)
- [ ] CSS optimization (PurgeCSS)
- [ ] API response caching
- [ ] Database query optimization
- [ ] CDN integration
- [ ] HTTP/2 server push

---

## Support

For issues or questions:
1. Check `PERFORMANCE_OPTIMIZATION.md` for detailed guide
2. Review `PERFORMANCE_TEST_RESULTS.md` for test results
3. Run automated tests: `npm run test:performance`
4. Check build output for warnings/errors
