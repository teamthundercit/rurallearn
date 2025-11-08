import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import useApi from '../utils/useApi';
import { getUserProfile, getUserProgress } from '../services/api';
import ProgressCard from '../components/ProgressCard';
import RecommendationPanel from '../components/RecommendationPanel';

const DashboardPage = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const api = useApi();
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get access token
        console.log('=== Getting Access Token ===');
        console.log('Audience:', process.env.REACT_APP_AUTH0_AUDIENCE);

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }
        });

        console.log('Token received:', token ? 'Yes (length: ' + token.length + ')' : 'No');
        console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'N/A');

        // Sync user with backend
        console.log('=== Calling /api/auth/callback ===');
        console.log('API URL:', process.env.REACT_APP_API_URL);
        console.log('Authorization header:', `Bearer ${token.substring(0, 20)}...`);

        const callbackResponse = await api.post('/api/auth/callback', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Callback response:', callbackResponse.data);

        // Fetch user profile and progress data
        const [userResponse, progressResponse] = await Promise.all([
          getUserProfile(token),
          getUserProgress(token)
        ]);

        setUserData(userResponse.data?.user || userResponse.user);

        // Handle progress data structure
        const progressInfo = progressResponse.data || progressResponse;
        setProgressData({
          progress: progressInfo.progress || [],
          summary: progressInfo.summary || null
        });
      } catch (err) {
        console.error('=== Dashboard Error ===');
        console.error('Error:', err);
        console.error('Error message:', err.message);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        console.error('=====================');

        setError(err.response?.data?.error?.message || err.message || 'Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  // Get progress metrics from summary or calculate from progress data
  const getMetrics = () => {
    // Use summary data from backend if available
    if (progressData?.summary) {
      return {
        completedLessons: progressData.summary.completedLessons || 0,
        averageScore: progressData.summary.averageQuizScore || 0,
        totalTimeSpent: progressData.summary.totalTimeSpent || 0
      };
    }

    // Fallback to calculating from progress array
    if (!progressData?.progress || progressData.progress.length === 0) {
      return {
        completedLessons: 0,
        averageScore: 0,
        totalTimeSpent: 0
      };
    }

    const completedLessons = progressData.progress.filter(p => p.status === 'completed').length;

    const quizScores = progressData.progress
      .filter(p => p.quizScore !== null && p.quizScore !== undefined)
      .map(p => p.quizScore);

    const averageScore = quizScores.length > 0
      ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
      : 0;

    const totalTimeSpent = progressData.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    return {
      completedLessons,
      averageScore,
      totalTimeSpent
    };
  };

  const metrics = getMetrics();
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

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            icon="📚"
            title="Lessons Completed"
            value={metrics.completedLessons}
            color="primary"
          />
          <ProgressCard
            icon="🎯"
            title="Average Score"
            value={`${metrics.averageScore}%`}
            color="secondary"
          />
          <ProgressCard
            icon="⏱️"
            title="Time Spent"
            value={`${Math.round(metrics.totalTimeSpent)}m`}
            color="accent"
          />
        </div>

        {/* AI Recommendations Section */}
        <div className="mb-8">
          <RecommendationPanel />
        </div>

        {/* Recent Progress Section */}
        {progressData?.progress && progressData.progress.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Progress
            </h3>
            <div className="space-y-3">
              {progressData.progress.slice(0, 5).map((progress, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/lessons/${progress.lessonId?._id || progress.lessonId}`)}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {progress.lessonId?.title || `Lesson ${progress.lessonId}`}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${progress.status === 'completed' ? 'bg-green-100 text-green-800' :
                        progress.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {progress.status.replace('_', ' ')}
                      </span>
                      {progress.lessonId?.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${progress.lessonId.difficulty === 'beginner' ? 'bg-blue-100 text-blue-800' :
                          progress.lessonId.difficulty === 'intermediate' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {progress.lessonId.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {progress.timeSpent > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {Math.round(progress.timeSpent)}m
                        </p>
                        <p className="text-xs text-gray-500">Time Spent</p>
                      </div>
                    )}
                    {progress.quizScore !== null && progress.quizScore !== undefined && (
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          {progress.quizScore}%
                        </p>
                        <p className="text-xs text-gray-500">Quiz Score</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Learn?
              </h3>
              <p className="text-gray-600">
                {progressData?.progress && progressData.progress.length > 0
                  ? 'Continue your learning journey with new lessons'
                  : 'Start your learning journey by exploring available lessons'}
              </p>
            </div>
            <button
              onClick={() => navigate('/lessons')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse Lessons
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
