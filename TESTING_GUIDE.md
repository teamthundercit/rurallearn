# Dashboard Gamification - Testing Guide 🧪

## Quick Start Testing

### 1. Start the Backend
```bash
cd backend
npm start
```
Expected: Server running on http://localhost:5000

### 2. Start the Frontend
```bash
cd frontend
npm start
```
Expected: App running on http://localhost:3000

### 3. Login and Navigate to Dashboard
- Login with Auth0
- Should redirect to dashboard automatically
- All 8 gamification components should be visible

---

## Component Testing Checklist

### 🔥 Learning Streak
**Test Cases**:
- [ ] Shows "0 days" for new user
- [ ] Increments after completing lesson
- [ ] Shows correct color based on streak length
- [ ] Displays longest streak
- [ ] Shows next milestone

**How to Test**:
1. Complete a lesson
2. Check streak updates to 1
3. Complete quiz to trigger update
4. Verify streak displays correctly

---

### 🏆 Achievement Badges
**Test Cases**:
- [ ] Shows empty state for new user
- [ ] Displays earned badges
- [ ] Hover shows tooltip with description
- [ ] Shows total points
- [ ] "View all" appears when 6+ badges

**How to Test**:
1. Complete first lesson → Should earn "First Steps" badge
2. Hover over badge → Tooltip appears
3. Complete 5 lessons → Should earn "Getting Started"
4. Score 100% → Should earn "Perfect Score"

---

### 📈 Weekly Activity Chart
**Test Cases**:
- [ ] Shows empty state for new user
- [ ] Displays 7 days (Sun-Sat)
- [ ] Today is highlighted in accent color
- [ ] Bar height reflects lesson count
- [ ] Shows total time spent

**How to Test**:
1. Complete lessons on different days
2. Check bars appear for those days
3. Verify today is highlighted
4. Check time totals are accurate

---

### ⚡ Quick Actions
**Test Cases**:
- [ ] "Resume Learning" shows last lesson
- [ ] "Browse Lessons" navigates to /lessons
- [ ] "Retake Quiz" disabled when no failed quizzes
- [ ] "AI Recommended" shows recommendation
- [ ] All buttons navigate correctly

**How to Test**:
1. Start a lesson but don't complete
2. Check "Resume Learning" shows that lesson
3. Fail a quiz (score < 70%)
4. Check "Retake Quiz" becomes enabled
5. Click each button to verify navigation

---

### 🎯 Learning Goals Progress
**Test Cases**:
- [ ] Shows default goals (3 weekly, 12 monthly)
- [ ] Progress bars update correctly
- [ ] Color changes based on progress
- [ ] "Edit Goals" opens settings
- [ ] Can save new goals
- [ ] Motivational messages appear

**How to Test**:
1. Check default goals display
2. Complete lessons to see progress
3. Click "Edit Goals"
4. Change goals and save
5. Verify new goals persist

---

### 🌟 Recent Achievements
**Test Cases**:
- [ ] Shows empty state for new user
- [ ] Displays recent completions
- [ ] Shows recent badges
- [ ] Sorted by date (newest first)
- [ ] Shows scores for completions
- [ ] Relative dates ("Today", "2 days ago")

**How to Test**:
1. Complete a lesson
2. Check it appears in timeline
3. Earn a badge
4. Check badge appears with "!" indicator
5. Verify dates are formatted correctly

---

### ⏰ Study Reminders
**Test Cases**:
- [ ] Shows 3 reminder types
- [ ] "Settings" opens configuration
- [ ] Can set reminder time
- [ ] Can select reminder days
- [ ] Settings persist
- [ ] Smart descriptions update

**How to Test**:
1. Click "Settings"
2. Change reminder time
3. Select different days
4. Save settings
5. Refresh page to verify persistence

---

### 🏅 Leaderboard
**Test Cases**:
- [ ] Shows user's rank
- [ ] Displays top 5 learners
- [ ] All names are anonymous
- [ ] Timeframe selector works
- [ ] Rank badges display correctly
- [ ] Streak indicators show

**How to Test**:
1. Complete lessons to earn points
2. Check your rank appears
3. Verify names are "Anonymous XXXX"
4. Change timeframe (week/month/all)
5. Check rankings update

---

## API Testing

### Test Endpoints with Postman/Thunder Client

#### 1. Get Progress (Enhanced)
```
GET http://localhost:5000/api/progress
Authorization: Bearer {token}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "progress": [...],
    "summary": {...},
    "weeklyActivity": [...],
    "recentAchievements": [...],
    "weeklyProgress": 2,
    "monthlyProgress": 8,
    "lastLesson": {...},
    "failedQuizzes": [...],
    "nextLessons": [],
    "reviewLessons": [...]
  }
}
```

#### 2. Record Lesson Completion
```
POST http://localhost:5000/api/progress/lesson/{lessonId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "timeSpent": 30
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {...},
  "gamification": {
    "streak": {
      "current": 1,
      "longest": 1
    },
    "newBadges": [...]
  },
  "message": "Lesson completion recorded successfully"
}
```

#### 3. Submit Quiz
```
POST http://localhost:5000/api/progress/quiz/{lessonId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [0, 1, 2, 0]
}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "progress": {...},
    "quizResults": {
      "score": 75,
      "passed": true,
      "correctAnswers": 3,
      "totalQuestions": 4
    }
  },
  "gamification": {
    "streak": {...},
    "newBadges": [...]
  },
  "message": "Quiz passed! Great job!"
}
```

#### 4. Get Leaderboard
```
GET http://localhost:5000/api/progress/leaderboard?timeframe=week
Authorization: Bearer {token}
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "leaderboard": [...],
    "userRank": 5,
    "topLearners": [...]
  }
}
```

---

## Gamification Logic Testing

### Streak Testing
**Scenario 1: First Activity**
1. New user completes lesson
2. Expected: streak.current = 1, streak.longest = 1

**Scenario 2: Consecutive Days**
1. User learns today
2. User learns tomorrow
3. Expected: streak.current = 2

**Scenario 3: Streak Break**
1. User has 5-day streak
2. User skips 2 days
3. User learns again
4. Expected: streak.current = 1, streak.longest = 5

**Scenario 4: Same Day Multiple Lessons**
1. User completes 3 lessons today
2. Expected: streak.current increments only once

---

### Badge Testing
**Test Each Badge**:

1. **First Steps** (1 lesson)
   - Complete 1 lesson
   - Check badge awarded

2. **Getting Started** (5 lessons)
   - Complete 5 lessons
   - Check badge awarded

3. **Perfect Score** (100% quiz)
   - Score 100% on any quiz
   - Check badge awarded

4. **High Achiever** (90%+ average)
   - Maintain 90%+ average across quizzes
   - Check badge awarded

5. **3-Day Streak**
   - Learn 3 consecutive days
   - Check badge awarded

6. **Speed Demon** (5 lessons in 1 day)
   - Complete 5 lessons today
   - Check badge awarded

---

### Points Testing
**Test Point Calculations**:

1. **Lesson Completion**
   - Complete lesson
   - Expected: +10 points

2. **Quiz Score 80%**
   - Score 80% on quiz
   - Expected: +10 (base) + 8 (score) = 18 points

3. **Perfect Score**
   - Score 100% on quiz
   - Expected: +10 (base) + 10 (score) + 20 (bonus) = 40 points

4. **Excellent Score (95%)**
   - Score 95% on quiz
   - Expected: +10 (base) + 9 (score) + 10 (bonus) = 29 points

---

## Integration Testing

### Full User Journey
1. **New User**
   - Login for first time
   - Complete onboarding
   - See empty dashboard states
   - All components show "get started" messages

2. **First Lesson**
   - Browse lessons
   - Start first lesson
   - Complete lesson
   - Earn "First Steps" badge
   - Streak becomes 1
   - Points = 10
   - Appears in recent achievements

3. **First Quiz**
   - Take quiz
   - Score 85%
   - Earn points (10 + 8 = 18)
   - Total points = 28
   - Appears in recent achievements

4. **Multiple Days**
   - Learn tomorrow
   - Streak becomes 2
   - Weekly activity shows 2 days
   - Goal progress updates

5. **Leaderboard**
   - Check rank
   - See anonymous names
   - Verify points match

---

## Performance Testing

### Load Time Checks
- [ ] Dashboard loads in < 2 seconds
- [ ] Components render smoothly
- [ ] No layout shifts
- [ ] Animations at 60fps
- [ ] API calls complete quickly

### Stress Testing
- [ ] Multiple rapid lesson completions
- [ ] Concurrent badge earning
- [ ] Large leaderboard (100+ users)
- [ ] Long achievement history
- [ ] Many badges (10+)

---

## Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Responsive Breakpoints
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

---

## Error Handling Testing

### Network Errors
- [ ] Offline mode
- [ ] Slow connection
- [ ] API timeout
- [ ] Server error (500)

### Data Errors
- [ ] Missing user data
- [ ] Invalid lesson ID
- [ ] Corrupted progress
- [ ] Empty responses

### Edge Cases
- [ ] No lessons completed
- [ ] No badges earned
- [ ] Zero streak
- [ ] Failed all quizzes
- [ ] Negative time spent

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all components
- [ ] Enter to activate buttons
- [ ] Escape to close modals
- [ ] Arrow keys for navigation

### Screen Reader
- [ ] All images have alt text
- [ ] Buttons have labels
- [ ] Headings are hierarchical
- [ ] ARIA labels present

### Visual
- [ ] High contrast mode
- [ ] Color blind friendly
- [ ] Text scaling (200%)
- [ ] Focus indicators visible

---

## Bug Reporting Template

```markdown
### Bug Description
[Clear description of the issue]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [e.g., Chrome 119]
- OS: [e.g., Windows 11]
- Screen Size: [e.g., 1920x1080]

### Screenshots
[If applicable]

### Console Errors
[Any error messages]
```

---

## Success Criteria

### All Tests Pass ✅
- [ ] All components render
- [ ] All APIs respond correctly
- [ ] All gamification logic works
- [ ] All badges can be earned
- [ ] All navigation works
- [ ] All data persists
- [ ] All animations smooth
- [ ] All responsive breakpoints work
- [ ] All browsers supported
- [ ] All accessibility standards met

### Ready for Production 🚀
When all checkboxes above are checked, the dashboard is ready for production deployment!

---

## Quick Test Script

```bash
# Run this to quickly test all major features

# 1. Start servers
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Login

# 4. Complete these actions:
# - Complete 1 lesson (earn First Steps badge)
# - Take 1 quiz (earn points)
# - Check all 8 components display
# - Navigate using Quick Actions
# - Edit goals
# - Check leaderboard

# 5. Verify:
# - Streak = 1
# - Points > 0
# - 1 badge earned
# - Recent achievements shows activity
# - Weekly chart shows today
# - Goals show progress
```

---

**Happy Testing! 🎉**
