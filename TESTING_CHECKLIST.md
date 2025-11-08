# RuralLearn E2E Testing Checklist

This document provides a comprehensive checklist for manual end-to-end testing of the RuralLearn platform.

## Prerequisites

- Backend server running on http://localhost:5000
- Frontend server running on http://localhost:3000
- MongoDB Atlas connection configured
- Auth0 application configured
- Gemini API key configured
- Test user account created in Auth0

## 1. Authentication Flow Testing

### 1.1 User Signup/Login
- [ ] Navigate to http://localhost:3000
- [ ] Click "Login" button
- [ ] Verify Auth0 Universal Login page loads
- [ ] Complete login with test credentials
- [ ] Verify redirect to dashboard after successful login
- [ ] Verify user profile displays correctly

### 1.2 Authentication Errors
- [ ] Test login with invalid credentials
- [ ] Verify error message displays
- [ ] Verify retry mechanism works
- [ ] Test session persistence across page refreshes

### 1.3 Logout
- [ ] Click logout button
- [ ] Verify redirect to login page
- [ ] Verify protected routes are inaccessible after logout

## 2. Dashboard Testing

### 2.1 Profile Display
- [ ] Verify user name displays correctly
- [ ] Verify user email displays correctly
- [ ] Verify user role displays correctly
- [ ] Verify avatar/profile picture displays (if available)

### 2.2 Progress Metrics
- [ ] Verify "Lessons Completed" count displays
- [ ] Verify "Average Quiz Score" displays
- [ ] Verify "Time Spent Learning" displays
- [ ] Complete a lesson and verify metrics update

### 2.3 Navigation
- [ ] Click "Browse Lessons" button
- [ ] Verify navigation to lessons list page
- [ ] Navigate back to dashboard
- [ ] Verify all navigation links work

## 3. Lesson Viewing Testing

### 3.1 Lessons List
- [ ] Verify lessons list loads
- [ ] Verify lesson cards display title, description, difficulty
- [ ] Test filtering by difficulty (if implemented)
- [ ] Test filtering by tags (if implemented)
- [ ] Click on a lesson card

### 3.2 Text Lesson
- [ ] Select a text-based lesson
- [ ] Verify lesson title displays
- [ ] Verify lesson content renders correctly
- [ ] Verify text formatting is preserved
- [ ] Scroll through entire lesson

### 3.3 Video Lesson
- [ ] Select a video-based lesson
- [ ] Verify video player loads
- [ ] Play video and verify playback works
- [ ] Test pause/resume functionality
- [ ] Test video controls (volume, fullscreen)

### 3.4 Mixed Content Lesson
- [ ] Select a lesson with both text and video
- [ ] Verify both content types display correctly
- [ ] Verify proper layout and spacing

## 4. Quiz Testing

### 4.1 Quiz Display
- [ ] Complete viewing a lesson
- [ ] Verify quiz appears after lesson content
- [ ] Verify all quiz questions display
- [ ] Verify all answer options display

### 4.2 Quiz Interaction
- [ ] Select answers for all questions
- [ ] Verify answer selection is highlighted
- [ ] Change an answer and verify update
- [ ] Submit quiz

### 4.3 Quiz Results
- [ ] Verify quiz score displays correctly
- [ ] Verify correct answers are shown
- [ ] Verify explanations display for each question
- [ ] Verify incorrect answers are highlighted
- [ ] Verify score is saved to progress

### 4.4 Quiz Retake
- [ ] Retake the same quiz
- [ ] Verify previous answers are not pre-selected
- [ ] Submit with different answers
- [ ] Verify new score updates progress

## 5. Progress Tracking Testing

### 5.1 Lesson Completion
- [ ] Complete a new lesson
- [ ] Verify "Mark as Complete" button works
- [ ] Return to dashboard
- [ ] Verify completed lessons count increased
- [ ] Verify lesson shows as completed in lessons list

### 5.2 Quiz Score Tracking
- [ ] Complete multiple quizzes with different scores
- [ ] Return to dashboard
- [ ] Verify average quiz score is calculated correctly
- [ ] Verify individual quiz scores are saved

### 5.3 Time Tracking
- [ ] Spend time on a lesson (at least 5 minutes)
- [ ] Complete the lesson
- [ ] Return to dashboard
- [ ] Verify time spent is recorded and displayed

### 5.4 Progress Persistence
- [ ] Complete several lessons
- [ ] Log out
- [ ] Log back in
- [ ] Verify all progress is retained
- [ ] Verify dashboard shows correct metrics

## 6. AI Features Testing

### 6.1 Recommendations
- [ ] Navigate to dashboard
- [ ] Verify recommendations panel displays
- [ ] Verify personalized recommendations load
- [ ] Click on a recommended lesson
- [ ] Verify navigation to lesson works

### 6.2 Recommendation Quality
- [ ] Complete lessons of varying difficulty
- [ ] Check recommendations
- [ ] Verify recommendations match your progress level
- [ ] Verify recommendations are relevant

### 6.3 Chatbot (if implemented)
- [ ] Open chatbot widget
- [ ] Send a message
- [ ] Verify AI response is received
- [ ] Test multiple conversation turns
- [ ] Verify conversation history is maintained
- [ ] Close and reopen chatbot
- [ ] Verify history persists

## 7. Offline Functionality Testing

### 7.1 Offline Detection
- [ ] Open browser DevTools
- [ ] Go to Network tab
- [ ] Set network to "Offline"
- [ ] Verify offline indicator appears
- [ ] Set network back to "Online"
- [ ] Verify offline indicator disappears

### 7.2 Cached Content Access
- [ ] While online, view several lessons
- [ ] Set network to "Offline"
- [ ] Navigate to previously viewed lessons
- [ ] Verify cached lessons load
- [ ] Verify content displays correctly

### 7.3 Offline Actions Queue
- [ ] Set network to "Offline"
- [ ] Complete a lesson
- [ ] Submit a quiz
- [ ] Verify actions are queued (check console or UI indicator)
- [ ] Set network back to "Online"
- [ ] Verify queued actions sync automatically
- [ ] Verify progress updates on dashboard

### 7.4 Offline Error Handling
- [ ] Set network to "Offline"
- [ ] Try to access a lesson not in cache
- [ ] Verify appropriate error message displays
- [ ] Verify user is informed about offline status

## 8. Error Handling Testing

### 8.1 Network Errors
- [ ] Simulate slow network (DevTools: Slow 3G)
- [ ] Verify loading indicators display
- [ ] Verify page loads within acceptable time
- [ ] Simulate network failure mid-request
- [ ] Verify error message displays
- [ ] Verify retry mechanism works

### 8.2 Invalid Data
- [ ] Manually navigate to invalid lesson ID (e.g., /lessons/invalid)
- [ ] Verify 404 error page or message displays
- [ ] Verify navigation back to valid page works

### 8.3 API Errors
- [ ] Stop backend server
- [ ] Try to load dashboard
- [ ] Verify error message displays
- [ ] Verify user is informed about service unavailability
- [ ] Restart backend server
- [ ] Verify app recovers gracefully

### 8.4 Authentication Errors
- [ ] Manually clear Auth0 token from storage
- [ ] Try to access protected route
- [ ] Verify redirect to login page
- [ ] Verify error message displays (if applicable)

## 9. UI/UX Testing

### 9.1 Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify all layouts adapt correctly
- [ ] Verify no horizontal scrolling
- [ ] Verify touch targets are adequate on mobile

### 9.2 Loading States
- [ ] Verify loading spinners display during data fetching
- [ ] Verify skeleton screens display (if implemented)
- [ ] Verify loading states don't block UI unnecessarily

### 9.3 User Feedback
- [ ] Complete various actions (lesson completion, quiz submission)
- [ ] Verify success messages display
- [ ] Verify error messages display when appropriate
- [ ] Verify toast notifications appear and disappear
- [ ] Verify feedback is clear and actionable

### 9.4 Accessibility
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify focus indicators are visible
- [ ] Test with screen reader (if available)
- [ ] Verify color contrast is adequate
- [ ] Verify all interactive elements are accessible

## 10. Performance Testing

### 10.1 Page Load Times
- [ ] Clear browser cache
- [ ] Load homepage
- [ ] Verify load time < 3 seconds
- [ ] Load dashboard
- [ ] Verify load time < 3 seconds
- [ ] Load lesson page
- [ ] Verify load time < 3 seconds

### 10.2 Low Bandwidth Testing
- [ ] Set network to "Slow 3G" in DevTools
- [ ] Navigate through app
- [ ] Verify pages load within acceptable time
- [ ] Verify images/videos load progressively
- [ ] Verify app remains usable

### 10.3 Low-Spec Device Testing
- [ ] Test on older device or simulate in DevTools (CPU throttling)
- [ ] Verify smooth scrolling
- [ ] Verify animations don't cause lag
- [ ] Verify interactions are responsive

## 11. Data Persistence Testing

### 11.1 Session Persistence
- [ ] Log in and complete actions
- [ ] Refresh page
- [ ] Verify session persists
- [ ] Verify data is retained

### 11.2 Cross-Session Persistence
- [ ] Complete lessons and quizzes
- [ ] Close browser completely
- [ ] Reopen browser and log in
- [ ] Verify all progress is retained

### 11.3 Multi-Device Persistence
- [ ] Complete lessons on one device
- [ ] Log in on different device
- [ ] Verify progress syncs across devices

## 12. Security Testing

### 12.1 Authentication Security
- [ ] Verify JWT tokens are used
- [ ] Verify tokens expire appropriately
- [ ] Verify refresh mechanism works
- [ ] Verify logout clears all tokens

### 12.2 API Security
- [ ] Try to access API endpoints without token
- [ ] Verify 401 Unauthorized response
- [ ] Try to access another user's data
- [ ] Verify 403 Forbidden response

## Test Results Summary

### Passed Tests: _____ / _____
### Failed Tests: _____ / _____
### Blocked Tests: _____ / _____

## Issues Found

| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| 1       |             |          |        |
| 2       |             |          |        |
| 3       |             |          |        |

## Notes

- Test Date: _______________
- Tester: _______________
- Environment: _______________
- Browser: _______________
- Additional Comments:
