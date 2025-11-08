import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './components/Auth0ProviderWithHistory';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineIndicator from './components/OfflineIndicator';
import { useOffline } from './hooks/useOffline';
import usePerformanceMonitor from './hooks/usePerformanceMonitor';

/**
 * Code Splitting Strategy:
 * - Each page is lazy-loaded as a separate bundle
 * - Routes are preloaded on hover/focus for better perceived performance
 * - Suspense boundaries provide loading states during code splitting
 * - This reduces initial bundle size and improves Time to Interactive (TTI)
 */

// Lazy load pages for code splitting
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ './pages/LoginPage'));
const OnboardingPage = lazy(() => import(/* webpackChunkName: "onboarding" */ './pages/OnboardingPage'));
const DashboardPage = lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/DashboardPage'));
const LessonsListPage = lazy(() => import(/* webpackChunkName: "lessons-list" */ './pages/LessonsListPage'));
const LessonPage = lazy(() => import(/* webpackChunkName: "lesson" */ './pages/LessonPage'));
const RefreshPage = lazy(() => import(/* webpackChunkName: "refresh" */ './pages/RefreshPage'));
const ChatbotWidget = lazy(() => import(/* webpackChunkName: "chatbot" */ './components/ChatbotWidget'));

// Export lazy components for preloading
export const lazyRoutes = {
  LoginPage,
  OnboardingPage,
  DashboardPage,
  LessonsListPage,
  LessonPage,
  RefreshPage,
  ChatbotWidget
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { isOnline, isSyncing, unsyncedCount } = useOffline();
  
  // Monitor performance and adaptively reduce animations if needed
  usePerformanceMonitor();

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
