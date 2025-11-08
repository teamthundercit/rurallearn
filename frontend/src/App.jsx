import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './components/Auth0ProviderWithHistory';
import ProtectedRoute from './components/ProtectedRoute';
// Temporarily disabled for debugging
// import OfflineIndicator from './components/OfflineIndicator';
// import { useOfflineSync } from './utils/useOfflineSync';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LessonsListPage = lazy(() => import('./pages/LessonsListPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'));
const TestAuthPage = lazy(() => import('./pages/TestAuthPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Check if we're handling an Auth0 callback
  const isAuth0Callback = React.useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasCallbackParams = searchParams.has('code') && searchParams.has('state');
    return hasCallbackParams && (isLoading || !isAuthenticated);
  }, [isLoading, isAuthenticated]);

  // Temporarily disabled offline sync for debugging
  // const [token, setToken] = React.useState(null);
  // React.useEffect(() => {
  //   const getToken = async () => {
  //     if (isAuthenticated) {
  //       try {
  //         const accessToken = await getAccessTokenSilently();
  //         setToken(accessToken);
  //       } catch (error) {
  //         console.error('Error getting token:', error);
  //       }
  //     }
  //   };
  //   getToken();
  // }, [isAuthenticated, getAccessTokenSilently]);
  // const { isOnline, isSyncing, unsyncedCount } = useOfflineSync(token);

  // Debug logging
  React.useEffect(() => {
    console.log('=== App State ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isLoading:', isLoading);
    console.log('isAuth0Callback:', isAuth0Callback);
    console.log('Current path:', window.location.pathname);
    console.log('================');
  }, [isAuthenticated, isLoading, isAuth0Callback]);

  // Show loading spinner during Auth0 callback processing
  // But only if we're actually loading, not if we're already authenticated
  if (isLoading) {
    console.log('Auth0 loading...');
    return <LoadingSpinner />;
  }

  // If we have callback params but we're authenticated, Auth0 is done - let it through
  if (isAuth0Callback && !isAuthenticated) {
    console.log('Auth0 processing callback...');
    return <LoadingSpinner />;
  }

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/test-auth" element={<TestAuthPage />} />
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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Temporarily disabled chatbot for debugging */}
        {/* {isAuthenticated && <ChatbotWidget />} */}
      </Suspense>

      {/* Temporarily disabled offline indicator for debugging */}
      {/* <OfflineIndicator isOnline={isOnline} isSyncing={isSyncing} unsyncedCount={unsyncedCount} /> */}
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
