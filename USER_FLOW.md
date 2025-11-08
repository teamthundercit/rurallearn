# RuralLearn Complete User Flow

## 🎯 Complete Learning Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    1️⃣ LOGIN WITH AUTH0                          │
│                                                                  │
│  User clicks "Login" → Auth0 Universal Login                    │
│  ├─ New User: Creates account                                   │
│  └─ Existing User: Enters credentials                           │
│                                                                  │
│  ✅ JWT Token Generated                                         │
│  ✅ User synced to MongoDB                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              2️⃣ ONBOARDING QUIZ (New Users Only)               │
│                                                                  │
│  Step 1: What are your learning goals?                          │
│  ├─ 💼 Advance my career                                        │
│  ├─ 🎯 Learn new skills                                         │
│  ├─ 📚 Support my education                                     │
│  ├─ 🌟 Personal interest/hobby                                  │
│  └─ 🚀 Start or grow a business                                 │
│                                                                  │
│  Step 2: What's your experience level?                          │
│  ├─ 🌱 Beginner                                                 │
│  ├─ 🌿 Intermediate                                             │
│  └─ 🌳 Advanced                                                 │
│                                                                  │
│  Step 3: What topics interest you?                              │
│  ├─ 🌾 Agriculture & Farming                                    │
│  ├─ 💻 Technology & Computers                                   │
│  ├─ 💼 Business & Entrepreneurship                              │
│  ├─ 🏥 Health & Wellness                                        │
│  ├─ 🗣️ Language Learning                                        │
│  ├─ 🔢 Mathematics                                              │
│  ├─ 🔬 Science                                                  │
│  └─ 🎨 Arts & Crafts                                            │
│                                                                  │
│  ✅ Preferences saved to MongoDB                                │
│  ✅ onboardingCompleted = true                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    3️⃣ DASHBOARD VIEW                            │
│                                                                  │
│  Progress Cards:                                                │
│  ┌──────────────┬──────────────┬──────────────┐                │
│  │ 📚 Lessons   │ 🎯 Avg Score │ ⏱️ Time Spent │                │
│  │ Completed: 5 │    85%       │    120m       │                │
│  └──────────────┴──────────────┴──────────────┘                │
│                                                                  │
│  AI Recommendations Panel:                                      │
│  ┌────────────────────────────────────────────┐                │
│  │ 🤖 Personalized Recommendations            │                │
│  │                                             │                │
│  │ Based on your preferences:                 │                │
│  │ • Learning Goals: career, skills           │                │
│  │ • Difficulty: beginner                     │                │
│  │ • Interests: technology, business          │                │
│  │                                             │                │
│  │ Recommended Lessons:                       │                │
│  │ 1. Introduction to Web Development (High)  │                │
│  │ 2. Basic Business Accounting (Medium)      │                │
│  │ 3. Computer Fundamentals (Medium)          │                │
│  └────────────────────────────────────────────┘                │
│                                                                  │
│  Recent Progress:                                               │
│  ├─ Lesson 1: HTML Basics (Completed, 90%)                     │
│  ├─ Lesson 2: CSS Styling (Completed, 85%)                     │
│  └─ Lesson 3: JavaScript Intro (In Progress)                   │
│                                                                  │
│  [Browse Lessons] Button                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  4️⃣ USER TAKES LESSON                           │
│                                                                  │
│  Lesson Content:                                                │
│  ├─ 📹 Video Player (if video lesson)                           │
│  ├─ 📝 Text Content                                             │
│  └─ ⏱️ Time tracking starts                                     │
│                                                                  │
│  [Complete Lesson & Take Quiz] Button                           │
│                                                                  │
│  ✅ Lesson completion recorded                                  │
│  ✅ Time spent saved to MongoDB                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    4️⃣ USER TAKES QUIZ                           │
│                                                                  │
│  Quiz Questions:                                                │
│  ┌────────────────────────────────────────────┐                │
│  │ Question 1: What is HTML?                  │                │
│  │ ○ A programming language                   │                │
│  │ ● A markup language                        │                │
│  │ ○ A database                               │                │
│  │ ○ An operating system                      │                │
│  └────────────────────────────────────────────┘                │
│                                                                  │
│  [Submit Quiz] Button                                           │
│                                                                  │
│  Quiz Results:                                                  │
│  ┌────────────────────────────────────────────┐                │
│  │ 🎉 Great job! Score: 85%                   │                │
│  │                                             │                │
│  │ ✅ Question 1: Correct                     │                │
│  │ ✅ Question 2: Correct                     │                │
│  │ ❌ Question 3: Incorrect                   │                │
│  │    Correct answer: B                       │                │
│  │    Explanation: ...                        │                │
│  └────────────────────────────────────────────┘                │
│                                                                  │
│  ✅ Quiz score saved to MongoDB                                 │
│  ✅ Progress status updated to "completed"                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              5️⃣ GEMINI AI UPDATES RECOMMENDATIONS               │
│                                                                  │
│  AI Analysis:                                                   │
│  ├─ User preferences (from onboarding)                          │
│  ├─ Completed lessons                                           │
│  ├─ Quiz scores (performance tracking)                          │
│  ├─ Time spent on lessons                                       │
│  └─ Learning patterns                                           │
│                                                                  │
│  Gemini AI Processing:                                          │
│  ┌────────────────────────────────────────────┐                │
│  │ 🤖 Analyzing your progress...              │                │
│  │                                             │                │
│  │ • Strong performance in HTML (90%)         │                │
│  │ • Good grasp of CSS (85%)                  │                │
│  │ • Ready for JavaScript fundamentals        │                │
│  │ • Aligns with "career" goal                │                │
│  │ • Matches "technology" interest            │                │
│  │                                             │                │
│  │ Next Recommendations:                      │                │
│  │ 1. JavaScript Basics (High Priority)       │                │
│  │    → Logical next step in web dev          │                │
│  │ 2. Responsive Web Design (Medium)          │                │
│  │    → Build on CSS knowledge                │                │
│  │ 3. Git & Version Control (Medium)          │                │
│  │    → Essential career skill                │                │
│  └────────────────────────────────────────────┘                │
│                                                                  │
│  ✅ New recommendations saved                                   │
│  ✅ Dashboard updated with fresh suggestions                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    🔄 REPEAT LEARNING LOOP
                    (Back to Dashboard → Lesson → Quiz)
```

## 📊 Data Flow

### MongoDB Collections

**Users Collection:**
```json
{
  "_id": "...",
  "auth0Id": "auth0|123...",
  "email": "student@example.com",
  "name": "John Doe",
  "role": "student",
  "preferences": {
    "onboardingCompleted": true,
    "learningGoals": ["career", "skills"],
    "difficultyLevel": "beginner",
    "topicsOfInterest": ["technology", "business"],
    "completedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Progress Collection:**
```json
{
  "_id": "...",
  "userId": "...",
  "lessonId": "...",
  "status": "completed",
  "quizScore": 85,
  "timeSpent": 15,
  "completedAt": "2024-01-01T00:00:00Z"
}
```

**AIInteraction Collection:**
```json
{
  "_id": "...",
  "userId": "...",
  "type": "recommendation",
  "input": {
    "completedLessons": 5,
    "averageScore": 85,
    "preferences": { ... }
  },
  "output": {
    "recommendations": [ ... ],
    "overallGuidance": "..."
  }
}
```

## 🔄 Learning Loop Details

### Initial State (New User)
1. Login → Onboarding → Empty Dashboard
2. No progress, no recommendations
3. AI suggests beginner lessons based on preferences only

### After First Lesson
1. Lesson completed + Quiz taken
2. Progress recorded (score, time)
3. AI updates recommendations based on:
   - Initial preferences
   - First quiz performance
   - Time spent learning

### Continuous Learning
1. Each lesson completion updates progress
2. Quiz scores refine difficulty recommendations
3. AI learns user's pace and preferences
4. Recommendations become more personalized

## 🎯 Key Features

- **Personalization**: Preferences + performance = tailored recommendations
- **Adaptive Learning**: AI adjusts difficulty based on quiz scores
- **Progress Tracking**: Complete history of learning journey
- **Offline Support**: Cached lessons, queued progress updates
- **Engagement**: Visual progress, encouraging feedback, clear goals

## 🚀 Technical Stack

- **Frontend**: React, TailwindCSS, Auth0 React SDK
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas
- **AI**: Google Gemini API
- **Auth**: Auth0 (JWT tokens)
- **Offline**: Service Worker, IndexedDB
