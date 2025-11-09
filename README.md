<div align="center">

# 🎓 EduAdapt

### AI-Powered Adaptive Learning Platform for Everyone, Everywhere

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 About

**EduAdapt** is an AI-powered adaptive learning platform designed to make quality education accessible to everyone, everywhere. Built specifically for students in underserved communities, EduAdapt provides personalized learning experiences that work offline, support multiple languages, and adapt to each learner's unique pace and style.

### Why EduAdapt?

- 🎯 **Personalized Learning**: AI analyzes performance and recommends perfect next lessons
- 🌐 **Works Offline**: Download lessons and learn without internet
- 🗣️ **Multilingual**: Currently supports English, Hindi, and Spanish
- 🎮 **Gamified**: Streaks, badges, points, and leaderboards keep learners engaged
- 🤖 **24/7 AI Tutor**: Get instant help anytime, anywhere
- 📊 **Progress Tracking**: Visual dashboards show growth and achievements
- 💰 **Affordable**: Free or low-cost alternative to expensive tutoring


---

## 🎯 The Problem

Students in rural and underserved areas face significant barriers to quality education:

- **Limited Access**: Lack of qualified teachers and educational resources
- **One-Size-Fits-All**: Traditional classrooms can't adapt to individual learning speeds
- **Connectivity Issues**: Unreliable or expensive internet access
- **Language Barriers**: Most content only available in English
- **Lack of Motivation**: Traditional learning feels monotonous and unrewarding
- **No Personalized Support**: Teachers can't provide individual attention to every student

---

## 💡 The Solution

EduAdapt addresses these challenges through:

1. **AI-Powered Personalization**: Analyzes quiz scores and learning patterns to recommend optimal next lessons
2. **Offline-First Architecture**: Download lessons, study anywhere, auto-sync when online
3. **Multilingual Support**: Learn in your native language (English, Hindi, Spanish, more coming)
4. **Gamification**: Streaks, badges, points, and leaderboards make learning addictive
5. **24/7 AI Chatbot**: Get instant answers to questions anytime
6. **Adaptive Difficulty**: Content automatically adjusts based on performance
7. **Comprehensive Analytics**: Track progress, identify strengths and weaknesses

---

## ✨ Features

### 🎓 Core Learning Features

- **Personalized Learning Paths**: AI recommends lessons based on your progress and goals
- **Interactive Lessons**: Video, text, and mixed-media content
- **Instant Quizzes**: Test knowledge with immediate feedback
- **Adaptive Difficulty**: Content adjusts to your skill level
- **Progress Tracking**: Visual dashboards show your growth

### 🎮 Gamification

- **Learning Streaks**: Track consecutive days of learning
- **Achievement Badges**: Earn 12+ badges for milestones
- **Points System**: Earn points for lessons and quiz scores
- **Leaderboard**: Compete with peers (anonymously)
- **Weekly Goals**: Set and track learning objectives

### 🤖 AI Features

- **Smart Recommendations**: AI suggests perfect next lessons
- **24/7 Chatbot**: Ask questions anytime in any language
- **Performance Analysis**: Identifies strengths and weaknesses
- **Personalized Feedback**: Get tailored study guidance

### 🌐 Accessibility

- **Offline Mode**: Download lessons for offline study
- **Multilingual**: English, Hindi (हिन्दी), Spanish (Español)
- **Low Bandwidth**: Optimized for 2G/3G connections
- **Mobile-First**: Works on any device
- **WCAG AA Compliant**: Accessible to all users

### 📊 Analytics & Insights

- **Progress Dashboard**: Visual metrics and charts
- **Weekly Activity**: Track learning patterns
- **Goal Progress**: Monitor weekly/monthly objectives
- **Recent Achievements**: Timeline of accomplishments
- **Performance Trends**: See improvement over time

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI framework with hooks and concurrent features
- **TailwindCSS 3.3** - Utility-first CSS with custom animations
- **Framer Motion** - Advanced animations and micro-interactions
- **React Router 6** - Client-side routing
- **Auth0 React SDK** - Authentication
- **Axios** - HTTP client
- **i18next** - Internationalization
- **TensorFlow.js** - Client-side ML for offline recommendations

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **Google Gemini AI** - AI-powered recommendations and chat
- **Auth0 JWT** - Token-based authentication
- **TensorFlow.js** - Fallback AI recommendations

### External Services
- **Auth0** - Authentication and user management
- **MongoDB Atlas** - Cloud database hosting
- **Google Gemini API** - AI recommendations and chatbot

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Services │  │  Hooks   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │              │              │              │         │
│       └──────────────┴──────────────┴──────────────┘         │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │ REST API
┌─────────────────────────┼─────────────────────────────────────┐
│                         │                                     │
│                    ┌────▼────┐                               │
│                    │ Express │                               │
│                    │ Router  │                               │
│                    └────┬────┘                               │
│                         │                                     │
│       ┌─────────────────┼─────────────────┐                 │
│       │                 │                 │                 │
│  ┌────▼────┐      ┌────▼────┐      ┌────▼────┐            │
│  │Controllers│    │Middleware│    │ Services │            │
│  └────┬────┘      └─────────┘      └────┬────┘            │
│       │                                   │                 │
│       │         Backend (Node.js)         │                 │
│       │                                   │                 │
│  ┌────▼────┐                         ┌───▼────┐            │
│  │ Models  │                         │   AI   │            │
│  └────┬────┘                         │Service │            │
│       │                              └───┬────┘            │
└───────┼──────────────────────────────────┼─────────────────┘
        │                                  │
   ┌────▼────┐                        ┌───▼────┐
   │ MongoDB │                        │ Gemini │
   │  Atlas  │                        │   AI   │
   └─────────┘                        └────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Auth0 Account** - [Sign up](https://auth0.com/)
- **Google Gemini API Key** - [Get key](https://aistudio.google.com/app/apikey)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/eduadapt.git
cd eduadapt
```

#### 2. Install Dependencies

**Install all dependencies (backend + frontend):**
```bash
npm run install:all
```

**Or install separately:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 3. Set Up Environment Variables

**Backend Environment Variables:**

Create `backend/.env` file:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduadapt?retryWrites=true&w=majority

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://eduadapt-api

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Frontend Environment Variables:**

Create `frontend/.env` file:

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=your-tenant.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
REACT_APP_AUTH0_AUDIENCE=https://eduadapt-api

# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

#### 4. Set Up MongoDB Atlas

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a new cluster** (free tier is fine)
3. **Create a database user** with read/write permissions
4. **Whitelist your IP address** (or use 0.0.0.0/0 for development)
5. **Get your connection string** and add it to `backend/.env`

#### 5. Set Up Auth0

1. **Create an Auth0 account** at [auth0.com](https://auth0.com/)
2. **Create a new application** (Single Page Application)
3. **Configure settings:**
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
4. **Create an API** in Auth0:
   - Name: EduAdapt API
   - Identifier: `https://eduadapt-api`
5. **Copy credentials** to `.env` files

#### 6. Get Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to `backend/.env`

#### 7. Seed Database (Optional)

Populate the database with sample lessons:

```bash
cd backend
npm run seed:lessons
```

#### 8. Start the Application

**Option 1: Run both servers simultaneously**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

**Option 2: Use the root scripts**

From the root directory:
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

#### 9. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the EduAdapt login page!

---

## 🔐 Environment Variables

### Backend Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment | No | `development` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `AUTH0_DOMAIN` | Auth0 tenant domain | Yes | `tenant.us.auth0.com` |
| `AUTH0_AUDIENCE` | Auth0 API identifier | Yes | `https://eduadapt-api` |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | `AIzaSy...` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |

### Frontend Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_AUTH0_DOMAIN` | Auth0 tenant domain | Yes | `tenant.us.auth0.com` |
| `REACT_APP_AUTH0_CLIENT_ID` | Auth0 client ID | Yes | `waP5Ajv...` |
| `REACT_APP_AUTH0_AUDIENCE` | Auth0 API identifier | Yes | `https://eduadapt-api` |
| `REACT_APP_API_URL` | Backend API URL | Yes | `http://localhost:5000` |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### **Authentication**

```http
POST /api/auth/callback
```
Sync user with backend after Auth0 login.

**Request Body:**
```json
{
  "auth0Id": "auth0|123456",
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### **Users**

```http
GET /api/users/me
```
Get current user profile.

```http
PUT /api/users/me
```
Update user profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "preferences": {
    "language": "en",
    "learningGoals": ["math", "science"],
    "difficultyLevel": "intermediate"
  }
}
```

#### **Lessons**

```http
GET /api/lessons
```
Get all lessons with optional filters.

**Query Parameters:**
- `difficulty` - Filter by difficulty (beginner/intermediate/advanced)
- `tags` - Filter by tags (comma-separated)
- `search` - Search in title and description

```http
GET /api/lessons/:id
```
Get specific lesson details.

#### **Progress**

```http
GET /api/progress
```
Get user's progress with gamification data.

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": [...],
    "summary": {
      "totalLessons": 50,
      "completedLessons": 12,
      "averageScore": 85,
      "totalTimeSpent": 360
    },
    "streak": {
      "current": 5,
      "longest": 10
    },
    "badges": [...],
    "weeklyActivity": [...],
    "leaderboard": {...}
  }
}
```

```http
POST /api/progress/lesson/:id
```
Record lesson completion.

**Request Body:**
```json
{
  "timeSpent": 30
}
```

```http
POST /api/progress/quiz/:id
```
Submit quiz answers.

**Request Body:**
```json
{
  "answers": [0, 1, 2, 0]
}
```

```http
GET /api/progress/leaderboard?timeframe=week
```
Get leaderboard rankings.

**Query Parameters:**
- `timeframe` - week/month/all (default: week)

#### **AI**

```http
POST /api/ai/recommendations
```
Get personalized lesson recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "lessonTitle": "Introduction to Algebra",
        "reason": "Perfect match for your intermediate level",
        "priority": "high"
      }
    ],
    "overallGuidance": "You're making great progress!"
  }
}
```

```http
POST /api/ai/chat
```
Chat with AI assistant.

**Request Body:**
```json
{
  "message": "How do I solve quadratic equations?",
  "conversationHistory": []
}
```

### Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional details (development only)"
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401) - Invalid or expired token
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid request data
- `INTERNAL_ERROR` (500) - Server error

---

## 📁 Project Structure

```
eduadapt/
├── backend/                          # Node.js + Express backend
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js          # AI endpoints
│   │   ├── lessonController.js      # Lesson CRUD
│   │   ├── progressController.js    # Progress tracking
│   │   └── userController.js        # User management
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication
│   ├── models/
│   │   ├── AIInteraction.js         # AI interaction logs
│   │   ├── ContentSource.js         # Content sources
│   │   ├── Lesson.js                # Lesson schema
│   │   ├── Progress.js              # User progress
│   │   └── User.js                  # User schema
│   ├── routes/
│   │   ├── aiRoutes.js              # AI endpoints
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── lessonRoutes.js          # Lesson endpoints
│   │   ├── progressRoutes.js        # Progress endpoints
│   │   └── userRoutes.js            # User endpoints
│   ├── services/
│   │   ├── adaptiveLearningService.js    # Adaptive learning logic
│   │   ├── aiService.js                  # Gemini AI integration
│   │   ├── contentImportService.js       # Content import
│   │   ├── gamificationService.js        # Gamification logic
│   │   ├── lessonService.js              # Lesson business logic
│   │   ├── progressService.js            # Progress calculations
│   │   ├── tfRecommendationService.js    # TensorFlow.js AI
│   │   └── userService.js                # User operations
│   ├── scripts/
│   │   ├── addMoreLessons.js        # Add lessons script
│   │   ├── importOpenSourceContent.js    # Import content
│   │   └── seedLessons.js           # Seed database
│   ├── tests/
│   │   ├── e2e.test.js              # End-to-end tests
│   │   ├── error-handling.test.js   # Error handling tests
│   │   └── verify-error-handling.js # Verification script
│   ├── utils/
│   │   └── auth0Cache.js            # Auth0 caching
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   └── server.js                    # Entry point
│
├── frontend/                         # React frontend
│   ├── public/
│   │   ├── models/                  # Face-api.js models
│   │   ├── index.html               # HTML template
│   │   ├── robots.txt               # SEO
│   │   └── service-worker.js        # PWA service worker
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── AchievementBadges.jsx
│   │   │   ├── AdaptiveLearningInsights.jsx
│   │   │   ├── AnimatedLogo.jsx
│   │   │   ├── AttractiveSpinner.jsx
│   │   │   ├── Auth0ProviderWithHistory.jsx
│   │   │   ├── ChatbotWidget.jsx
│   │   │   ├── FeatureTile.jsx
│   │   │   ├── GlobalLoader.jsx
│   │   │   ├── GlowButton.jsx
│   │   │   ├── GradientProgressBar.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── LearningGoalsProgress.jsx
│   │   │   ├── LearningStreak.jsx
│   │   │   ├── MoodCheckModal.jsx
│   │   │   ├── OfflineIndicator.jsx
│   │   │   ├── ParticleBackground.jsx
│   │   │   ├── PlatformStats.jsx
│   │   │   ├── PreloadLink.jsx
│   │   │   ├── ProgressCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── QuizComponent.jsx
│   │   │   ├── RecentAchievements.jsx
│   │   │   ├── RecommendationPanel.jsx
│   │   │   ├── StickyGlassHeader.jsx
│   │   │   ├── StudyReminders.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── TrendBadge.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── WeeklyActivityChart.jsx
│   │   │   └── WelcomeMessage.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx     # Theme provider
│   │   ├── hooks/
│   │   │   ├── useOffline.js        # Offline detection
│   │   │   └── usePerformanceMonitor.js  # Performance monitoring
│   │   ├── i18n/
│   │   │   ├── config.js            # i18n configuration
│   │   │   └── locales/
│   │   │       ├── en.json          # English translations
│   │   │       ├── hi.json          # Hindi translations
│   │   │       └── es.json          # Spanish translations
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Main dashboard
│   │   │   ├── LessonPage.jsx       # Lesson viewer
│   │   │   ├── LessonsListPage.jsx  # Browse lessons
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   ├── OnboardingPage.jsx   # Onboarding wizard
│   │   │   └── RefreshPage.jsx      # Refresh handler
│   │   ├── services/
│   │   │   └── api.js               # API client
│   │   ├── utils/
│   │   │   └── helpers.js           # Helper functions
│   │   ├── App.jsx                  # Root component
│   │   ├── index.css                # Global styles
│   │   ├── index.js                 # Entry point
│   │   ├── reportWebVitals.js       # Performance monitoring
│   │   └── setupTests.js            # Test configuration
│   ├── .env.example                 # Environment template
│   ├── craco.config.js              # CRACO configuration
│   ├── package.json                 # Dependencies
│   ├── postcss.config.js            # PostCSS config
│   └── tailwind.config.js           # TailwindCSS config
│
├── .kiro/                           # Kiro AI specs
│   └── specs/
│       └── next-gen-ui-ux-transformation/
│           ├── requirements.md      # Feature requirements
│           ├── design.md            # Design document
│           └── tasks.md             # Implementation tasks
│
├── .gitignore                       # Git ignore rules
├── LICENSE                          # MIT License
├── package.json                     # Root package.json
├── README.md                        # This file
└── [Documentation Files]            # Various .md files
```

---

## 📚 Usage Guide

### For Students

#### 1. **First Time Setup**

1. **Login**: Click "Login with Google" on the homepage
2. **Onboarding**: Complete the 3-step onboarding wizard:
   - Set your learning goals
   - Choose difficulty level
   - Select topics of interest
3. **Dashboard**: You'll be redirected to your personalized dashboard

#### 2. **Browse and Start Lessons**

1. Click **"Browse Lessons"** from the dashboard
2. Use filters to find lessons:
   - Filter by difficulty (Beginner/Intermediate/Advanced)
   - Filter by tags (Math, Science, etc.)
   - Search by keyword
3. Click on a lesson card to view details
4. Click **"Start Lesson"** to begin learning

#### 3. **Complete Lessons**

1. Watch videos or read content
2. Take notes as you learn
3. Click **"Mark as Complete"** when finished
4. Take the quiz to test your knowledge
5. Get instant feedback on your answers

#### 4. **Take Quizzes**

1. Read each question carefully
2. Select your answer
3. Click **"Submit Quiz"**
4. View your score and correct answers
5. Retake if needed to improve your score

#### 5. **Track Your Progress**

**Dashboard Overview:**
- **Progress Cards**: See lessons completed, quiz scores, time spent
- **Learning Streak**: Track consecutive days of learning
- **Achievement Badges**: View earned badges and total points
- **Weekly Activity**: See your learning pattern over 7 days
- **Leaderboard**: Compare your progress with peers

**Set Goals:**
1. Click **"Edit Goals"** in the Learning Goals section
2. Set weekly and monthly lesson targets
3. Track progress toward your goals

#### 6. **Get AI Recommendations**

1. Check the **"AI Recommendations"** panel on your dashboard
2. AI suggests lessons based on:
   - Your completed lessons
   - Quiz performance
   - Learning goals
   - Difficulty level
3. Click on recommended lessons to start learning

#### 7. **Use the AI Chatbot**

1. Click the **chatbot icon** (bottom-right corner)
2. Type your question
3. Get instant answers in your language
4. Ask for:
   - Concept explanations
   - Study tips
   - Homework help
   - Motivation and encouragement

#### 8. **Learn Offline**

1. **Download Lessons** (when online):
   - Open a lesson
   - Click "Download for Offline"
2. **Study Offline**:
   - Access downloaded lessons anytime
   - Complete quizzes offline
   - Progress is saved locally
3. **Sync Progress** (when online):
   - Connect to internet
   - Progress automatically syncs
   - Check sync status in the offline indicator

#### 9. **Change Language**

1. Click the **language selector** in the header
2. Choose from:
   - 🇬🇧 English
   - 🇮🇳 हिन्दी (Hindi)
   - 🇪🇸 Español (Spanish)
3. Interface updates immediately
4. Preference is saved automatically

#### 10. **Earn Badges**

Complete these milestones to earn badges:

| Badge | How to Earn |
|-------|-------------|
| 🎯 First Steps | Complete 1 lesson |
| ⭐ Getting Started | Complete 5 lessons |
| 🌟 Dedicated Learner | Complete 10 lessons |
| 💫 Knowledge Seeker | Complete 20 lessons |
| 💯 Perfect Score | Score 100% on any quiz |
| 🏆 High Achiever | Maintain 90%+ average |
| 🔥 3-Day Streak | Learn 3 consecutive days |
| 🔥🔥 Week Warrior | Learn 7 consecutive days |
| 🔥🔥🔥 Month Master | Learn 30 consecutive days |
| ⚡ Speed Demon | Complete 5 lessons in 1 day |
| 🎓 Quiz Master | Pass 10 quizzes |
| 💪 Comeback Kid | Improve score by 20%+ |

---

### For Parents

#### Monitor Your Child's Progress

1. **Login** with your account
2. **View Dashboard** to see:
   - Lessons completed
   - Quiz scores and averages
   - Time spent learning
   - Learning streaks
   - Earned badges
3. **Check Weekly Activity** to see learning patterns
4. **Review Recent Achievements** to celebrate milestones

#### Support Learning Goals

1. Help your child **set realistic goals**
2. **Encourage daily learning** to maintain streaks
3. **Celebrate achievements** when badges are earned
4. **Review progress** weekly to identify areas needing help

---

### For Teachers

#### Assign Lessons

1. Browse the lesson library
2. Share lesson links with students
3. Set deadlines for completion
4. Monitor completion rates

#### Track Student Progress

1. View individual student dashboards
2. Check quiz scores and averages
3. Identify struggling students early
4. Provide targeted interventions

#### Use Analytics

1. Review class-wide statistics
2. Identify common weak areas
3. Adjust teaching based on data
4. Celebrate class achievements

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing Checklist

#### Authentication
- [ ] Login with Google OAuth
- [ ] Logout successfully
- [ ] Token refresh works
- [ ] Protected routes redirect to login

#### Lessons
- [ ] Browse lessons with filters
- [ ] View lesson details
- [ ] Complete a lesson
- [ ] Mark lesson as complete

#### Quizzes
- [ ] Take a quiz
- [ ] Submit answers
- [ ] View results
- [ ] Retake quiz

#### Progress
- [ ] View dashboard
- [ ] See progress cards
- [ ] Check weekly activity
- [ ] View leaderboard

#### Gamification
- [ ] Earn first badge
- [ ] Maintain streak
- [ ] Earn points
- [ ] See rank on leaderboard

#### AI Features
- [ ] Get recommendations
- [ ] Chat with AI
- [ ] Recommendations update after progress

#### Offline Mode
- [ ] Download lesson
- [ ] Complete lesson offline
- [ ] Sync when online
- [ ] Offline indicator shows status

#### Multilingual
- [ ] Switch language
- [ ] UI updates immediately
- [ ] Preference persists
- [ ] All strings translated

### Performance Testing

```bash
# Run Lighthouse audit
npm run build:frontend
# Open Chrome DevTools > Lighthouse > Run audit

# Test load times
# Target: < 2.3s page load
# Target: 60fps animations
```

---

## 🚢 Deployment

### Deploy Backend

#### Option 1: Railway

1. **Create Railway account** at [railway.app](https://railway.app/)
2. **Create new project** from GitHub repo
3. **Add environment variables** in Railway dashboard
4. **Deploy** - Railway auto-deploys on push

#### Option 2: Render

1. **Create Render account** at [render.com](https://render.com/)
2. **New Web Service** from GitHub repo
3. **Configure**:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. **Add environment variables**
5. **Deploy**

#### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create eduadapt-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set AUTH0_DOMAIN=your_auth0_domain
heroku config:set AUTH0_AUDIENCE=your_auth0_audience
heroku config:set GEMINI_API_KEY=your_gemini_key

# Deploy
git subtree push --prefix backend heroku main
```

---

### Deploy Frontend

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel
```

3. **Set environment variables** in Vercel dashboard
4. **Production deployment**:
```bash
vercel --prod
```

#### Option 2: Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Build**:
```bash
cd frontend
npm run build
```

3. **Deploy**:
```bash
netlify deploy --prod --dir=build
```

4. **Set environment variables** in Netlify dashboard

#### Option 3: GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/eduadapt"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

### Environment Variables for Production

**Backend (Production):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://eduadapt-api
GEMINI_API_KEY=your_production_key
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (Production):**
```env
REACT_APP_AUTH0_DOMAIN=your-tenant.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_production_client_id
REACT_APP_AUTH0_AUDIENCE=https://eduadapt-api
REACT_APP_API_URL=https://your-backend-domain.com
```

---

### Post-Deployment Checklist

- [ ] Backend health check responds: `GET /health`
- [ ] Database connection works: `GET /api/health/db`
- [ ] Frontend loads without errors
- [ ] Auth0 login works
- [ ] API calls succeed
- [ ] Environment variables set correctly
- [ ] CORS configured for production domain
- [ ] SSL/HTTPS enabled
- [ ] Error tracking configured (optional: Sentry)
- [ ] Analytics configured (optional: Google Analytics)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open an issue describing the bug
2. **Suggest Features**: Open an issue with your feature idea
3. **Submit Pull Requests**: Fix bugs or add features
4. **Improve Documentation**: Help make docs clearer
5. **Translate**: Add support for more languages
6. **Create Content**: Add lessons and educational content

### Development Workflow

1. **Fork the repository**
```bash
# Click "Fork" on GitHub
```

2. **Clone your fork**
```bash
git clone https://github.com/yourusername/eduadapt.git
cd eduadapt
```

3. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

4. **Make your changes**
```bash
# Edit files
# Test your changes
```

5. **Commit your changes**
```bash
git add .
git commit -m "Add: your feature description"
```

6. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

7. **Open a Pull Request**
- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Describe your changes
- Submit PR

### Commit Message Guidelines

Use conventional commits:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

Examples:
```
feat: Add Spanish language support
fix: Resolve quiz submission error
docs: Update installation instructions
style: Format dashboard components
refactor: Optimize AI recommendation service
test: Add unit tests for gamification
chore: Update React to 18.2.0
```

### Code Style

- **JavaScript**: Follow Airbnb style guide
- **React**: Use functional components and hooks
- **CSS**: Use TailwindCSS utility classes
- **Naming**: Use camelCase for variables, PascalCase for components
- **Comments**: Add JSDoc comments for functions

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm test`)
- [ ] No console.log statements
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] PR description explains changes
- [ ] Screenshots included (for UI changes)

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start

**Error**: `Cannot connect to MongoDB`
```bash
# Check MongoDB URI in .env
# Ensure IP is whitelisted in MongoDB Atlas
# Verify database user credentials
```

**Error**: `GEMINI_API_KEY not configured`
```bash
# Get API key from https://aistudio.google.com/app/apikey
# Add to backend/.env
# Restart backend server
```

#### Frontend won't start

**Error**: `Module not found`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Auth0 configuration error`
```bash
# Verify Auth0 credentials in frontend/.env
# Check Auth0 application settings
# Ensure callback URLs are configured
```

#### Login not working

1. Check Auth0 configuration
2. Verify callback URLs in Auth0 dashboard
3. Check browser console for errors
4. Clear browser cache and cookies
5. Try incognito mode

#### AI recommendations not working

1. Check Gemini API key is valid
2. Verify API key has quota remaining
3. Check backend logs for errors
4. System will fallback to TensorFlow.js if Gemini fails

#### Offline mode not working

1. Check service worker is registered
2. Verify HTTPS (required for service workers)
3. Check browser supports service workers
4. Clear service worker cache

### Getting Help

- **Documentation**: Check docs in `/docs` folder
- **Issues**: Search [GitHub Issues](https://github.com/yourusername/eduadapt/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/eduadapt/discussions)
- **Email**: contact@eduadapt.com

---

## 📊 Performance Metrics

### Target Metrics

- **Page Load**: < 2.3 seconds
- **Time to Interactive**: < 3.5 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Animation FPS**: 60fps
- **API Response**: < 500ms
- **Lighthouse Score**: 90+

### Optimization Techniques

1. **Code Splitting**: Route-based lazy loading
2. **Image Optimization**: WebP with PNG fallback
3. **Caching**: Service worker caching
4. **Minification**: Production builds minified
5. **CDN**: Static assets on CDN
6. **Compression**: Gzip/Brotli compression
7. **Lazy Loading**: Images and components
8. **Memoization**: React.memo for expensive components

---

## 🔒 Security

### Security Measures

- **Authentication**: Auth0 JWT tokens
- **Authorization**: Role-based access control
- **HTTPS**: SSL/TLS encryption
- **Input Validation**: Server-side validation
- **SQL Injection**: Mongoose parameterized queries
- **XSS Protection**: React auto-escaping
- **CSRF Protection**: SameSite cookies
- **Rate Limiting**: API rate limits
- **Environment Variables**: Secrets in .env files
- **Dependencies**: Regular security audits

### Security Best Practices

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 EduAdapt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Team

### Core Contributors

- **Your Name** - Project Lead - [@yourusername](https://github.com/yourusername)

### Contributors

Thanks to all contributors who have helped make EduAdapt better!

<!-- Add contributor avatars -->
<a href="https://github.com/yourusername/eduadapt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yourusername/eduadapt" />
</a>

---

## 📞 Contact

- **Website**: [eduadapt.com](https://eduadapt.com)
- **Email**: contact@eduadapt.com
- **Twitter**: [@eduadapt](https://twitter.com/eduadapt)
- **LinkedIn**: [EduAdapt](https://linkedin.com/company/eduadapt)
- **GitHub**: [github.com/yourusername/eduadapt](https://github.com/yourusername/eduadapt)

---

## 🙏 Acknowledgments

- **Auth0** - Authentication platform
- **MongoDB** - Database hosting
- **Google Gemini** - AI capabilities
- **TailwindCSS** - UI framework
- **React** - Frontend framework
- **Open Source Community** - Inspiration and support

---

## 📈 Roadmap

### Phase 1: Core Features ✅ (Completed)
- [x] User authentication
- [x] Lesson management
- [x] Progress tracking
- [x] AI recommendations
- [x] Gamification
- [x] Multilingual support
- [x] Offline mode

### Phase 2: Enhanced Features 🚧 (In Progress)
- [ ] Mobile apps (iOS/Android)
- [ ] Video conferencing for live classes
- [ ] Peer-to-peer learning
- [ ] Discussion forums
- [ ] Advanced analytics dashboard
- [ ] Teacher admin panel

### Phase 3: Scale & Expand 📅 (Planned)
- [ ] Support 10+ languages
- [ ] 1000+ lessons across subjects
- [ ] AI-generated personalized content
- [ ] Voice-based learning
- [ ] AR/VR learning experiences
- [ ] Certification programs

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/eduadapt&type=Date)](https://star-history.com/#yourusername/eduadapt&Date)

---

<div align="center">

### Made with ❤️ for learners everywhere

**If you find EduAdapt helpful, please consider giving it a ⭐ on GitHub!**

[⬆ Back to Top](#-eduadapt)

</div>
