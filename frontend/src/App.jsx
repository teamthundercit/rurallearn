import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './components/Auth0ProviderWithHistory';
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import DashboardPage from './pages/DashboardPage';
import LessonsListPage from './pages/LessonsListPage';
import LessonPage from './pages/LessonPage';

function AppContent() {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <LessonsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      {/* Show chatbot only when authenticated */}
      {isAuthenticated && <ChatbotWidget />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Auth0ProviderWithHistory>
        <AppContent />
      </Auth0ProviderWithHistory>
    </Router>
  );
}

export default App;
