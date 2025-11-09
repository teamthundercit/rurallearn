<div align="center">

# 🎓 EduAdapt

### AI-Powered Adaptive Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)

**Personalized education that works offline, speaks your language, and adapts to your pace.**

[Features](#-features) • [Quick Start](#-quick-start) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

EduAdapt is an AI-powered adaptive learning platform designed for students in underserved communities. It provides personalized learning experiences that work offline, support multiple languages, and adapt to each learner's unique pace.

### Key Highlights

- 🎯 **AI-Powered Personalization** - Recommends lessons based on your performance
- 🌐 **Works Offline** - Download lessons and learn without internet
- 🗣️ **Multilingual** - English, Hindi (हिन्दी), Spanish (Español)
- 🎮 **Gamified** - Streaks, badges, points, and leaderboards
- 🤖 **24/7 AI Tutor** - Get instant help anytime
- 📊 **Progress Tracking** - Visual dashboards and analytics

---

## ✨ Features

### Core Learning
- Personalized lesson recommendations
- Interactive video and text content
- Instant quiz feedback
- Adaptive difficulty adjustment
- Comprehensive progress tracking

### Gamification
- Daily learning streaks
- 12+ achievement badges
- Points and leaderboard system
- Weekly/monthly goal tracking

### AI Features
- Smart lesson recommendations
- 24/7 chatbot assistant
- Performance analysis
- Personalized study guidance

### Accessibility
- Full offline support
- 3 languages (expanding to 10+)
- Low bandwidth optimization
- Mobile-first responsive design
- WCAG AA compliant

---

## 🛠️ Tech Stack

**Frontend:** React 18, TailwindCSS, Framer Motion, Auth0, i18next, TensorFlow.js

**Backend:** Node.js, Express, MongoDB, Mongoose, Google Gemini AI, Auth0 JWT

**Services:** Auth0 (Auth), MongoDB Atlas (Database), Google Gemini (AI)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Auth0 account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/eduadapt.git
cd eduadapt
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://eduadapt-api
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env`:
```env
REACT_APP_AUTH0_DOMAIN=your-tenant.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
REACT_APP_AUTH0_AUDIENCE=https://eduadapt-api
REACT_APP_API_URL=http://localhost:5000
```

4. **Seed database (optional)**
```bash
cd backend
npm run seed:lessons
```

5. **Start the application**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

6. **Open your browser**
```
http://localhost:3000
```

### Setup Guides

**MongoDB Atlas:**
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (free tier)
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string

**Auth0:**
1. Create account at [auth0.com](https://auth0.com/)
2. Create Single Page Application
3. Configure URLs: `http://localhost:3000`
4. Create API with identifier: `https://eduadapt-api`
5. Copy credentials to `.env`

**Google Gemini:**
1. Visit [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create API key
3. Add to `backend/.env`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### Users
```http
GET  /api/users/me              # Get current user
PUT  /api/users/me              # Update profile
```

#### Lessons
```http
GET  /api/lessons               # Get all lessons (with filters)
GET  /api/lessons/:id           # Get lesson details
```

#### Progress
```http
GET  /api/progress              # Get user progress
POST /api/progress/lesson/:id   # Record lesson completion
POST /api/progress/quiz/:id     # Submit quiz
GET  /api/progress/leaderboard  # Get leaderboard
```

#### AI
```http
POST /api/ai/recommendations    # Get personalized recommendations
POST /api/ai/chat               # Chat with AI assistant
```

### Example Response
```json
{
  "success": true,
  "data": {
    "progress": [...],
    "summary": {
      "completedLessons": 12,
      "averageScore": 85
    },
    "streak": {
      "current": 5,
      "longest": 10
    },
    "badges": [...]
  }
}
```

---

## 📁 Project Structure

```
eduadapt/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI, gamification)
│   ├── scripts/         # Seed scripts
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components (30+)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── hooks/       # Custom hooks
│   │   ├── i18n/        # Translations
│   │   └── context/     # React context
│   └── public/          # Static assets
│
└── package.json         # Root scripts
```

---

## 🎮 Usage

### For Students

1. **Login** with Google
2. **Complete onboarding** (set goals, difficulty, interests)
3. **Browse lessons** and start learning
4. **Take quizzes** to test knowledge
5. **Track progress** on dashboard
6. **Earn badges** and maintain streaks
7. **Get AI recommendations** for next lessons
8. **Chat with AI** for help anytime

### Earning Badges

| Badge | Requirement |
|-------|-------------|
| 🎯 First Steps | Complete 1 lesson |
| ⭐ Getting Started | Complete 5 lessons |
| 💯 Perfect Score | Score 100% on quiz |
| 🔥 3-Day Streak | Learn 3 consecutive days |
| ⚡ Speed Demon | Complete 5 lessons in 1 day |

---

## 🚢 Deployment

### Backend (Railway/Render/Heroku)

1. Create account on platform
2. Connect GitHub repository
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Install CLI: `npm install -g vercel`
2. Deploy: `cd frontend && vercel`
3. Add environment variables
4. Production: `vercel --prod`

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

### Commit Guidelines
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
```

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB URI in `.env`
- Verify Gemini API key
- Ensure port 5000 is available

**Frontend won't start:**
- Delete `node_modules` and reinstall
- Check Auth0 credentials
- Verify backend is running

**Login not working:**
- Check Auth0 callback URLs
- Clear browser cache
- Try incognito mode

**AI not working:**
- Verify Gemini API key
- Check API quota
- System falls back to TensorFlow.js

---

## �  Contributors

This project was built by:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/SmithC05">
        <img src="https://github.com/SmithC05.png" width="100px;" alt="Smith C"/>
        <br />
        <sub><b>Smith C</b></sub>
      </a>
      <br />
      <a href="https://github.com/SmithC05" title="GitHub">💻</a>
      <a href="https://linkedin.com/in/mrsmithc" title="LinkedIn">💼</a>
    </td>
    <td align="center">
      <a href="https://github.com/BalajiVadivel0">
        <img src="https://github.com/BalajiVadivel0.png" width="100px;" alt="Balaji V"/>
        <br />
        <sub><b>Balaji V</b></sub>
      </a>
      <br />
      <a href="https://github.com/BalajiVadivel0" title="GitHub">💻</a>
      <a href="https://linkedin.com/in/balajiv0506" title="LinkedIn">💼</a>
    </td>
    <td align="center">
      <a href="https://github.com/Libin-anto">
        <img src="https://github.com/Libin-anto.png" width="100px;" alt="Libin Anto E"/>
        <br />
        <sub><b>Libin Anto E</b></sub>
      </a>
      <br />
      <a href="https://github.com/Libin-anto" title="GitHub">💻</a>
      <a href="http://linkedin.com/in/libin-anto-064838327" title="LinkedIn">💼</a>
    </td>
    <td align="center">
      <a href="https://github.com/sanjaybalanm">
        <img src="https://github.com/sanjaybalanm.png" width="100px;" alt="Sanjay Balan M"/>
        <br />
        <sub><b>Sanjay Balan M</b></sub>
      </a>
      <br />
      <a href="https://github.com/sanjaybalanm" title="GitHub">💻</a>
      <a href="https://www.linkedin.com/in/sanjay-balan-m-558747316" title="LinkedIn">💼</a>
    </td>
  </tr>
</table>

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

Built with Auth0, MongoDB Atlas, Google Gemini AI, React, and TailwindCSS

---

<div align="center">

**Made with ❤️ for learners everywhere**

⭐ Star us on GitHub if you find this helpful!

</div>
