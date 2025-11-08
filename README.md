# RuralLearn

Personalized, offline-first learning platform for rural education.

## Project Structure

```
rurallearn/
├── backend/          # Node.js + Express API
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── server.js     # Entry point
├── frontend/         # React + TailwindCSS
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── index.html
└── README.md
```

## Tech Stack

### Frontend
- React 18 (Create React App)
- TailwindCSS
- React Router
- Auth0 React SDK
- Axios

### Backend
- Node.js
- Express
- Mongoose
- Auth0 JWT Bearer
- Google Generative AI SDK

### External Services
- Auth0 (Authentication)
- MongoDB Atlas (Database)
- Google Gemini AI (Personalization)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Auth0 account
- Google Gemini API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
copy .env.example .env
```

4. Update `.env` with your credentials:
   - MongoDB connection string
   - Auth0 domain and audience
   - Gemini API key

5. Start the server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
copy .env.example .env
```

4. Update `.env` with your credentials:
   - Auth0 domain and client ID
   - Backend API URL

5. Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `AUTH0_DOMAIN` - Auth0 tenant domain
- `AUTH0_AUDIENCE` - Auth0 API identifier
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `REACT_APP_AUTH0_DOMAIN` - Auth0 tenant domain
- `REACT_APP_AUTH0_CLIENT_ID` - Auth0 client ID
- `REACT_APP_AUTH0_AUDIENCE` - Auth0 API identifier
- `REACT_APP_API_URL` - Backend API URL

## Development

### Running Both Services

Open two terminal windows:

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

## License

MIT