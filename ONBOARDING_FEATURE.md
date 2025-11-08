# Onboarding Quiz Feature

## Overview
The onboarding quiz collects user preferences during their first login to personalize their learning experience. This data is used by the AI recommendation engine to suggest relevant lessons.

## User Flow

1. **Login with Auth0** → User authenticates
2. **Onboarding Quiz** → New users are redirected to `/onboarding`
3. **Dashboard** → After completing onboarding, users see personalized recommendations
4. **Lesson Quiz** → User takes quizzes after lessons
5. **AI Updates** → Gemini uses quiz results + preferences to refine recommendations

## Implementation Details

### Backend Changes

#### 1. User Model (`backend/models/User.js`)
Added `preferences` field to store onboarding data:
```javascript
preferences: {
  onboardingCompleted: Boolean,
  learningGoals: [String],
  difficultyLevel: String (beginner/intermediate/advanced),
  topicsOfInterest: [String],
  completedAt: Date
}
```

#### 2. User Service (`backend/services/userService.js`)
- Added `updateUserPreferences()` function
- Marks `onboardingCompleted: true` when preferences are saved

#### 3. User Controller (`backend/controllers/userController.js`)
- Added `updateUserPreferences()` endpoint handler
- Validates input (learning goals, difficulty, topics)
- Returns updated user with preferences

#### 4. User Routes (`backend/routes/userRoutes.js`)
- Added `POST /api/users/me/preferences` endpoint

#### 5. AI Service (`backend/services/aiService.js`)
- Updated `generateRecommendations()` to include user preferences in Gemini prompt
- AI now considers learning goals, difficulty level, and topics of interest

### Frontend Changes

#### 1. Onboarding Page (`frontend/src/pages/OnboardingPage.jsx`)
New 3-step wizard:
- **Step 1**: Learning Goals (career, skills, education, hobby, business)
- **Step 2**: Difficulty Level (beginner, intermediate, advanced)
- **Step 3**: Topics of Interest (agriculture, technology, business, health, etc.)

Features:
- Progress indicator showing current step
- Multi-select for goals and topics
- Single-select for difficulty
- Validation before proceeding
- Saves to backend on completion

#### 2. App Routing (`frontend/src/App.jsx`)
- Added `/onboarding` route with ProtectedRoute wrapper
- Lazy loads OnboardingPage component

#### 3. Dashboard (`frontend/src/pages/DashboardPage.jsx`)
- Checks if `user.preferences.onboardingCompleted` is true
- Redirects to `/onboarding` if not completed
- Prevents access to dashboard until onboarding is done

#### 4. API Service (`frontend/src/services/api.js`)
- Added `updateUserPreferences()` function

## API Endpoints

### POST /api/users/me/preferences
Update user preferences (onboarding).

**Authentication:** Required

**Request Body:**
```json
{
  "learningGoals": ["career", "skills"],
  "difficultyLevel": "beginner",
  "topicsOfInterest": ["technology", "business"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "preferences": {
        "onboardingCompleted": true,
        "learningGoals": ["career", "skills"],
        "difficultyLevel": "beginner",
        "topicsOfInterest": ["technology", "business"],
        "completedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  },
  "message": "Preferences saved successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input (missing fields, wrong format)
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

## Testing

### Manual Testing Flow

1. **Create a new user:**
   - Clear browser data or use incognito mode
   - Go to http://localhost:3000
   - Click "Login" and create a new Auth0 account

2. **Verify onboarding redirect:**
   - After login, should automatically redirect to `/onboarding`
   - Should NOT be able to access `/dashboard` directly

3. **Complete onboarding:**
   - Step 1: Select at least one learning goal
   - Step 2: Select a difficulty level
   - Step 3: Select at least one topic
   - Click "Complete Setup"

4. **Verify dashboard access:**
   - Should redirect to `/dashboard` after completion
   - Should see personalized AI recommendations based on preferences

5. **Test AI recommendations:**
   - Check that recommendations align with selected preferences
   - Complete a lesson and take a quiz
   - Refresh recommendations to see updated suggestions

### Backend Testing

Test the preferences endpoint:
```bash
curl -X POST http://localhost:5000/api/users/me/preferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "learningGoals": ["career", "skills"],
    "difficultyLevel": "beginner",
    "topicsOfInterest": ["technology", "business"]
  }'
```

## UI/UX Features

- **Visual Progress Indicator**: Shows which step user is on (1/3, 2/3, 3/3)
- **Step Validation**: Can't proceed without selecting required options
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Icon-based Selection**: Visual icons make options more engaging
- **Smooth Transitions**: Steps transition smoothly
- **Error Handling**: Shows error messages if save fails

## AI Integration

The AI recommendation engine now uses preferences to:
1. **Filter by difficulty**: Prioritize lessons matching user's stated level
2. **Match topics**: Recommend lessons in areas of interest
3. **Align with goals**: Consider learning objectives when suggesting content
4. **Personalize guidance**: Provide contextual encouragement based on goals

Example AI prompt enhancement:
```
User Preferences (from onboarding):
- Learning Goals: career, skills
- Preferred Difficulty: beginner
- Topics of Interest: technology, business
```

## Future Enhancements

- [ ] Allow users to update preferences from settings page
- [ ] Add more topic options based on available lessons
- [ ] Track preference changes over time
- [ ] Use preference data for analytics
- [ ] Add "skip onboarding" option for experienced users
- [ ] Multi-language support for onboarding questions
- [ ] Add visual progress tracking showing how preferences influence recommendations
