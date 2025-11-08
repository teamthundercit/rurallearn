# AI Features Implementation

## Overview

Task 9 "Integrate Gemini AI for personalization" has been successfully implemented. This includes AI-powered lesson recommendations and an interactive chatbot assistant.

## What Was Implemented

### Backend (Node.js/Express)

#### 1. AI Service (`backend/services/aiService.js`)
- **Gemini AI Client Setup**: Initialized Google Generative AI client with API key
- **Recommendation Engine**: 
  - `generateRecommendations()` - Analyzes user progress and generates personalized lesson recommendations
  - Uses user's completed lessons, quiz scores, and available lessons to create context
  - Sends structured prompt to Gemini AI
  - Parses JSON response with recommendations and guidance
  - Stores interactions in AIInteraction model
- **Chatbot Handler**:
  - `handleChatMessage()` - Processes user messages and maintains conversation context
  - Provides educational assistance with conversation history
  - Stores chat interactions in database

#### 2. AI Controller (`backend/controllers/aiController.js`)
- **POST /api/ai/recommendations**: Generates personalized lesson recommendations
  - Fetches user data, progress, and available lessons
  - Calls AI service to generate recommendations
  - Returns formatted recommendations with priority levels
  - Handles Gemini API errors (rate limits, API key issues)
- **POST /api/ai/chat**: Handles chatbot conversations
  - Validates user input
  - Maintains conversation history (last 10 messages)
  - Returns AI responses with timestamps
  - Error handling for API failures

#### 3. AI Routes (`backend/routes/aiRoutes.js`)
- Configured routes with authentication middleware
- Both endpoints require valid Auth0 JWT token

#### 4. Server Integration (`backend/server.js`)
- Added AI routes to Express app at `/api/ai`

### Frontend (React)

#### 1. API Service Updates (`frontend/src/services/api.js`)
- `getRecommendations()` - Fetches AI-generated lesson recommendations
- `sendChatMessage()` - Sends chat messages to AI assistant

#### 2. RecommendationPanel Component (`frontend/src/components/RecommendationPanel.jsx`)
- Displays personalized lesson recommendations on dashboard
- Shows overall guidance message from AI
- Lists recommended lessons with:
  - Lesson title
  - Reason for recommendation
  - Priority level (high/medium/low) with color coding
- Click-to-navigate to recommended lessons
- Loading and error states

#### 3. ChatbotWidget Component (`frontend/src/components/ChatbotWidget.jsx`)
- Floating chat button in bottom-right corner
- Expandable chat window with:
  - Message history display
  - Real-time conversation with AI
  - Typing indicators
  - Timestamp for each message
  - Error handling
- Maintains conversation context (last 10 messages)
- Auto-scrolls to latest message
- Responsive design

#### 4. Dashboard Integration (`frontend/src/pages/DashboardPage.jsx`)
- Added RecommendationPanel to dashboard
- Displays AI recommendations prominently

#### 5. App Integration (`frontend/src/App.jsx`)
- ChatbotWidget available globally when user is authenticated
- Shows on all protected routes

## Environment Variables Required

Add to `backend/.env`:
```
GEMINI_API_KEY=your-gemini-api-key-here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Features

### AI Recommendations
- Analyzes user's learning progress
- Considers completed lessons and quiz scores
- Recommends next lessons based on:
  - Current skill level
  - Logical progression
  - Appropriate difficulty
  - Topic variety
- Provides personalized guidance message

### AI Chatbot
- Real-time educational assistance
- Maintains conversation context
- Encourages learning
- Available on all authenticated pages
- Persistent across navigation

## API Endpoints

### POST /api/ai/recommendations
**Authentication**: Required (Bearer token)

**Response**:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "lessonTitle": "Introduction to Variables",
        "reason": "This builds on your completed basics lesson",
        "priority": "high"
      }
    ],
    "overallGuidance": "You're making great progress! Focus on these lessons to strengthen your foundation."
  }
}
```

### POST /api/ai/chat
**Authentication**: Required (Bearer token)

**Request**:
```json
{
  "message": "Can you explain variables?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response": "Variables are containers for storing data values...",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Handling

Both endpoints handle:
- Invalid/expired Auth0 tokens (401)
- Missing user data (404)
- Gemini API key errors (500)
- Rate limiting (429)
- General API failures (500)

## Testing

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Test Recommendations**:
   - Log in to the application
   - Navigate to dashboard
   - View AI Recommendations panel
   - Click on recommended lessons

4. **Test Chatbot**:
   - Click the chat button (bottom-right)
   - Send a message
   - Verify AI response
   - Test conversation continuity

## Database Models Used

- **User**: User profile data
- **Progress**: Learning progress and quiz scores
- **Lesson**: Available lessons
- **AIInteraction**: Stores AI recommendations and chat history

## Notes

- Recommendations are generated on-demand when dashboard loads
- Chat history is maintained in component state (not persisted between sessions)
- AI interactions are logged to database for analytics
- Gemini API calls may have rate limits depending on your API key tier
- Fallback responses provided if AI service fails

## Requirements Satisfied

✅ 4.1 - Sends user progress data to Gemini AI
✅ 4.2 - Receives personalized recommendations from Gemini AI
✅ 4.3 - Displays suggested lessons to students
✅ 4.4 - Enables real-time conversation with Gemini AI (chatbot)
✅ 4.5 - Stores AI interaction history in MongoDB
