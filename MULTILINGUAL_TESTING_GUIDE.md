# Multilingual Support - Testing Guide 🧪

## Quick Test

### 1. Start Application
```bash
# Frontend
cd frontend
npm start

# Backend (if not running)
cd backend
npm start
```

### 2. Open Dashboard
```
http://localhost:3000
```

### 3. Test Language Switching
1. Look for language dropdown in header (next to profile)
2. Click dropdown
3. Select "हिन्दी" (Hindi)
4. Verify UI changes to Hindi
5. Select "Español" (Spanish)
6. Verify UI changes to Spanish
7. Select "English"
8. Verify UI changes back to English

---

## Detailed Testing

### Test 1: Language Switcher Visibility ✅
**Steps**:
1. Login to dashboard
2. Look at header

**Expected**:
- Language dropdown visible
- Shows current language with flag
- Positioned between logo and profile

**Pass Criteria**:
- Dropdown is visible
- Current language is displayed
- Flag emoji shows correctly

---

### Test 2: Language Switching ✅
**Steps**:
1. Click language dropdown
2. Select Hindi (हिन्दी)
3. Wait for UI to update

**Expected**:
- UI immediately changes to Hindi
- All text translates
- Layout remains intact
- No errors in console

**Pass Criteria**:
- Dashboard title in Hindi
- Navigation in Hindi
- Buttons in Hindi
- No broken layouts

---

### Test 3: Persistence ✅
**Steps**:
1. Switch to Spanish
2. Refresh page (F5)
3. Check language

**Expected**:
- Language remains Spanish
- No reset to English
- Preference saved

**Pass Criteria**:
- Spanish still active after refresh
- localStorage has 'i18nextLng' = 'es'

---

### Test 4: All Languages ✅
**For Each Language** (English, Hindi, Spanish):

**Steps**:
1. Switch to language
2. Navigate through app
3. Check all sections

**Expected**:
- Dashboard translated
- Navigation translated
- Buttons translated
- Messages translated
- No missing translations

**Pass Criteria**:
- All visible text translated
- No English fallbacks (unless intended)
- Proper character display

---

### Test 5: Dynamic Content ✅
**Steps**:
1. Switch to Hindi
2. Check dashboard title with name
3. Check streak counter
4. Check badge count

**Expected**:
- "Welcome back, [Name]!" in Hindi
- Numbers display correctly
- Pluralization works
- Interpolation works

**Pass Criteria**:
- Dynamic values inserted correctly
- Grammar is correct
- Numbers formatted properly

---

### Test 6: Error Handling ✅
**Steps**:
1. Disconnect internet
2. Try switching language
3. Reconnect
4. Try again

**Expected**:
- Language still changes locally
- Warning in console (not error)
- Preference saved to localStorage
- Syncs when reconnected

**Pass Criteria**:
- No crashes
- Language changes work
- Graceful degradation

---

### Test 7: New User Experience ✅
**Steps**:
1. Logout
2. Clear localStorage
3. Login again

**Expected**:
- Auto-detects browser language
- Falls back to English if not supported
- Can change language immediately

**Pass Criteria**:
- Correct initial language
- Switcher works for new users

---

### Test 8: Mobile Responsiveness ✅
**Steps**:
1. Open on mobile device or resize browser
2. Check language switcher
3. Switch languages

**Expected**:
- Switcher visible on mobile
- Dropdown works on touch
- Text doesn't overflow
- Layout adapts

**Pass Criteria**:
- Switcher accessible
- All languages work
- No layout issues

---

## Visual Verification

### English (en) 🇬🇧
```
Dashboard Title: "Welcome back, [Name]!"
Streak: "Learning Streak"
Badges: "Achievement Badges"
Lessons: "Browse Lessons"
```

### Hindi (hi) 🇮🇳
```
Dashboard Title: "वापसी पर स्वागत है, [Name]!"
Streak: "सीखने की लकीर"
Badges: "उपलब्धि बैज"
Lessons: "पाठ ब्राउज़ करें"
```

### Spanish (es) 🇪🇸
```
Dashboard Title: "¡Bienvenido de nuevo, [Name]!"
Streak: "Racha de Aprendizaje"
Badges: "Insignias de Logros"
Lessons: "Explorar Lecciones"
```

---

## Console Checks

### No Errors ✅
Open browser console (F12) and check for:
- ❌ No red errors
- ⚠️ Warnings are OK
- ✅ "i18next: initialized" message

### Network Tab ✅
Check network requests:
- Language change triggers preference save
- 200 OK response (or warning if offline)
- No failed requests

### localStorage ✅
Check Application > Local Storage:
- Key: `i18nextLng`
- Value: Current language code (en/hi/es)

---

## Common Issues & Solutions

### Issue: Language Not Changing
**Solution**:
1. Check console for errors
2. Verify translation files exist
3. Clear cache and reload
4. Check i18n configuration

### Issue: Missing Translations
**Solution**:
1. Check translation key in JSON
2. Verify correct namespace
3. Add missing translation
4. Fallback to English should work

### Issue: Broken Layout
**Solution**:
1. Check for long translations
2. Adjust CSS if needed
3. Use text truncation
4. Test with different languages

### Issue: Preference Not Saving
**Solution**:
1. Check authentication
2. Verify API endpoint
3. Check network tab
4. localStorage still works as fallback

---

## Performance Testing

### Load Time ✅
**Test**:
1. Clear cache
2. Reload page
3. Measure load time

**Expected**:
- < 3 seconds initial load
- < 100ms language switch
- No lag or freezing

### Bundle Size ✅
**Check**:
```bash
npm run build
# Check build/static/js/*.js sizes
```

**Expected**:
- Translation files add < 50KB
- Total bundle < 500KB
- Acceptable increase

---

## Accessibility Testing

### Keyboard Navigation ✅
**Test**:
1. Tab to language switcher
2. Press Enter to open
3. Arrow keys to navigate
4. Enter to select

**Expected**:
- Fully keyboard accessible
- Focus indicators visible
- Logical tab order

### Screen Reader ✅
**Test**:
1. Enable screen reader
2. Navigate to switcher
3. Listen to announcements

**Expected**:
- "Select language" announced
- Current language announced
- Options announced clearly

---

## Browser Compatibility

### Desktop Browsers ✅
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers ✅
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

---

## Sign-Off Checklist

### Functionality ✅
- [ ] Language switcher visible
- [ ] All 3 languages work
- [ ] Switching is instant
- [ ] Preference persists
- [ ] No console errors

### Translations ✅
- [ ] English complete
- [ ] Hindi complete
- [ ] Spanish complete
- [ ] No missing keys
- [ ] Proper formatting

### User Experience ✅
- [ ] Intuitive interface
- [ ] Smooth transitions
- [ ] Clear feedback
- [ ] Works offline
- [ ] Mobile friendly

### Performance ✅
- [ ] Fast load times
- [ ] No lag
- [ ] Small bundle size
- [ ] Efficient rendering

### Quality ✅
- [ ] No bugs found
- [ ] Translations accurate
- [ ] Layout intact
- [ ] Accessible
- [ ] Well documented

---

## Test Results Template

```markdown
## Test Session: [Date]
**Tester**: [Name]
**Browser**: [Browser + Version]
**Device**: [Desktop/Mobile]

### Tests Passed: X/8
- [ ] Test 1: Language Switcher Visibility
- [ ] Test 2: Language Switching
- [ ] Test 3: Persistence
- [ ] Test 4: All Languages
- [ ] Test 5: Dynamic Content
- [ ] Test 6: Error Handling
- [ ] Test 7: New User Experience
- [ ] Test 8: Mobile Responsiveness

### Issues Found:
1. [Issue description]
2. [Issue description]

### Notes:
[Any additional observations]

### Recommendation:
[ ] Ready for Production
[ ] Needs Fixes
[ ] Needs More Testing
```

---

## Quick Smoke Test (5 minutes)

```bash
# 1. Start app
npm start

# 2. Login

# 3. Switch to Hindi
# Verify: UI in Hindi

# 4. Refresh page
# Verify: Still in Hindi

# 5. Switch to Spanish
# Verify: UI in Spanish

# 6. Switch to English
# Verify: UI in English

# 7. Check console
# Verify: No errors

# ✅ If all pass: READY TO DEPLOY
```

---

**Status**: READY FOR TESTING
**Estimated Time**: 30 minutes full test, 5 minutes smoke test
**Priority**: HIGH
