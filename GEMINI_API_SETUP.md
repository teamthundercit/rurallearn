# Gemini API Setup Guide

## Current Status
Your RuralLearn app now has **fallback mode** - it works without a valid Gemini API key by using rule-based recommendations instead of AI-powered ones.

## ⚠️ Your Current API Key Issue
The API key in your `.env` file (`AIzaSyDIqUbPsxUS4DPO2QQo79m707q0Z_qCkV0`) is invalid or expired.

## 🔑 How to Get a Valid Gemini API Key

### Step 1: Visit Google AI Studio
Go to: **https://aistudio.google.com/app/apikey**

### Step 2: Sign In
- Use your Google account
- Accept any terms of service if prompted

### Step 3: Create API Key
1. Click **"Get API key"** or **"Create API key"**
2. Choose **"Create API key in new project"** (or select existing project)
3. Copy the generated key (starts with `AIza...`)

### Step 4: Update Your .env File
Open `backend/.env` and replace the current key:

```env
# Replace this line:
GEMINI_API_KEY=AIzaSyDIqUbPsxUS4DPO2QQo79m707q0Z_qCkV0

# With your new key:
GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

### Step 5: Restart Backend Server
```bash
cd backend
npm run dev
```

## 🎯 What Works Now (Without Valid Key)

### ✅ Fallback Mode Features
- **Rule-based recommendations** instead of AI-powered
- Recommendations based on:
  - User's onboarding preferences
  - Difficulty level matching
  - Completed lesson count
  - Topics of interest
- All other features work normally:
  - Login/Authentication
  - Onboarding quiz
  - Lesson viewing
  - Quiz taking
  - Progress tracking

### ❌ What You're Missing (Without Valid Key)
- **AI-powered personalization**: Gemini analyzes your learning patterns
- **Contextual recommendations**: AI considers quiz performance trends
- **Adaptive difficulty**: AI adjusts based on your actual performance
- **Personalized guidance**: Custom motivational messages from AI

## 🔄 Fallback vs AI Recommendations

### Fallback Mode (Current)
```
Recommendations based on:
├─ Preferred difficulty level (from onboarding)
├─ Topics of interest (from onboarding)
└─ Simple filtering of available lessons

Example:
"Great next step based on your preferences"
"Recommended to expand your knowledge"
```

### AI Mode (With Valid Key)
```
Recommendations based on:
├─ Preferred difficulty level
├─ Topics of interest
├─ Quiz score trends
├─ Learning pace
├─ Skill progression patterns
└─ Contextual understanding of lesson relationships

Example:
"You excelled in HTML (90%), ready for JavaScript fundamentals"
"Your strong CSS performance suggests you'd enjoy Responsive Design"
```

## 🧪 Testing Your API Key

Create a test file `backend/test-gemini.js`:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello in 5 words');
    const response = await result.response;
    console.log('✅ Gemini API is working!');
    console.log('Response:', response.text());
  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
  }
}

testGemini();
```

Run it:
```bash
node backend/test-gemini.js
```

## 📊 API Key Limits (Free Tier)

Google's free tier includes:
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

This is more than enough for development and testing!

## 🔒 Security Best Practices

1. **Never commit .env files** to Git (already in .gitignore)
2. **Don't share your API key** publicly
3. **Rotate keys** if accidentally exposed
4. **Use environment variables** in production

## 🚀 Production Deployment

For production, set the environment variable on your hosting platform:

### Heroku
```bash
heroku config:set GEMINI_API_KEY=your_key_here
```

### Vercel
```bash
vercel env add GEMINI_API_KEY
```

### Railway
Add in the Variables section of your project settings

### AWS/Azure/GCP
Use their respective secrets management services

## 💡 Alternative: Keep Using Fallback Mode

If you prefer not to use Gemini AI:
1. The app works perfectly with rule-based recommendations
2. Simply leave the API key as-is or remove it
3. Users will still get personalized recommendations based on their onboarding preferences

The fallback mode is production-ready and provides a good user experience!

## 🆘 Troubleshooting

### Error: "API key not valid"
- Get a new key from https://aistudio.google.com/app/apikey
- Make sure you copied the entire key
- Check for extra spaces in .env file

### Error: "API key not found"
- Verify GEMINI_API_KEY is in backend/.env
- Restart your backend server after changing .env

### Error: "Rate limit exceeded"
- Free tier: 15 requests/minute
- Wait a minute and try again
- Consider upgrading if needed

### Fallback mode always activating
- Check server logs for API key warnings
- Verify the key starts with "AIza"
- Test with the test script above

## 📚 Resources

- **Google AI Studio**: https://aistudio.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **API Key Management**: https://aistudio.google.com/app/apikey
