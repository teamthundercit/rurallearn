import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './components/Auth0ProviderWithHistory';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineIndicator from './components/OfflineIndicator';
import { useOffline } from './hooks/useOffline';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LessonsListPage = lazy(() => import('./pages/LessonsListPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const RefreshPage = lazy(() => import('./pages/RefreshPage'));
const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { isOnline, isSyncing, unsyncedCount } = useOffline();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/refresh"
            element={
              <ProtectedRoute>
                <RefreshPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {isAuthenticated && <ChatbotWidget />}
        <OfflineIndicator 
          isOnline={isOnline} 
          isSyncing={isSyncing} 
          unsyncedCount={unsyncedCount} 
        />
      </Suspense>
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
