import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0ProviderWithHistory from './components/Auth0ProviderWithHistory';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineIndicator from './components/OfflineIndicator';
import { useOfflineSync } from './utils/useOfflineSync';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CallbackPage = lazy(() => import('./pages/CallbackPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LessonsListPage = lazy(() => import('./pages/LessonsListPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function AppContent() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = React.useState(null);

  // Get token for offline sync
  React.useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      }
    };
    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const { isOnline, isSyncing, unsyncedCount } = useOfflineSync(token);

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
      
      {/* Show offline indicator */}
      <OfflineIndicator 
        isOnline={isOnline} 
        isSyncing={isSyncing} 
        unsyncedCount={unsyncedCount} 
      />
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
