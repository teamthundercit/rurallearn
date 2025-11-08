import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useApi from '../utils/useApi';

const DashboardPage = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const api = useApi();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get access token
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }
        });

        // Sync user with backend
        const callbackResponse = await api.post('/api/auth/callback', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Get user profile
        const userResponse = await api.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(userResponse.data.data.user);
      } catch (err) {
        console.error('Error syncing user:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [getAccessTokenSilently, api]);

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayUser = userData || user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">RuralLearn</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{displayUser?.name}</p>
                <p className="text-xs text-gray-500">{displayUser?.email}</p>
                {userData?.role && (
                  <p className="text-xs text-primary-600 font-medium capitalize">
                    {userData.role}
                  </p>
                )}
              </div>
              {(user?.picture || displayUser?.avatar) && (
                <img
                  src={user?.picture || displayUser?.avatar}
                  alt={displayUser?.name}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {displayUser?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600">
            Continue your learning journey
          </p>
        </div>

        {/* Placeholder content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 text-3xl mb-2">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Lessons Completed
            </h3>
            <p className="text-3xl font-bold text-primary-600">0</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-secondary-600 text-3xl mb-2">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Average Score
            </h3>
            <p className="text-3xl font-bold text-secondary-600">0%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-accent-600 text-3xl mb-2">⏱️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Time Spent
            </h3>
            <p className="text-3xl font-bold text-accent-600">0h</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h3>
          <p className="text-gray-600 mb-4">
            Your dashboard is ready! The following features will be available soon:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Authentication with Auth0
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mr-2">○</span>
              Browse and view lessons
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mr-2">○</span>
              Take quizzes and track progress
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mr-2">○</span>
              Get AI-powered recommendations
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
