import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useApi from '../utils/useApi';
import { getUserProfile, getUserProgress, getLeaderboard } from '../services/api';
import ProgressCard from '../components/ProgressCard';
import RecommendationPanel from '../components/RecommendationPanel';
import LearningStreak from '../components/LearningStreak';
import AchievementBadges from '../components/AchievementBadges';
import WeeklyActivityChart from '../components/WeeklyActivityChart';
import QuickActions from '../components/QuickActions';
import LearningGoalsProgress from '../components/LearningGoalsProgress';
import RecentAchievements from '../components/RecentAchievements';
import StudyReminders from '../components/StudyReminders';
import Leaderboard from '../components/Leaderboard';
import LanguageSwitcher from '../components/LanguageSwitcher';

const DashboardPage = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const api = useApi();
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }
        });

        // Sync user with backend
        await api.post('/api/auth/callback', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch user profile, progress data, and leaderboard
        const [userResponse, progressResponse, leaderboardResponse] = await Promise.all([
          getUserProfile(token),
          getUserProgress(token),
          getLeaderboard(token, 'week').catch(err => {
            console.warn('Failed to fetch leaderboard:', err);
            return null;
          })
        ]);

        const fetchedUser = userResponse.data?.user || userResponse.user;
        setUserData(fetchedUser);

        // Check if onboarding is completed
        if (!fetchedUser.preferences?.onboardingCompleted) {
          navigate('/onboarding');
          return;
        }

        // Handle progress data structure
        const progressInfo = progressResponse.data || progressResponse;
        setProgressData(progressInfo);
        
        // Handle leaderboard data
        if (leaderboardResponse?.data) {
          setLeaderboardData(leaderboardResponse.data);
        }
      } catch (err) {
        console.error('Dashboard error:', err.message);
        setError(err.response?.data?.error?.message || err.message || 'Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getAccessTokenSilently, api, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Modern Header with Glassmorphism */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎓</span>
              </div>
              <h1 className="text-2xl font-display font-black text-gradient">EduAdapt</h1>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{displayUser?.name}</p>
                <p className="text-xs text-gray-600">{displayUser?.email}</p>
                {userData?.role && (
                  <span className="badge-primary text-xs mt-1 inline-block">
                    {userData.role}
                  </span>
                )}
              </div>
              
              {(user?.picture || displayUser?.avatar) && (
                <div className="relative">
                  <img
                    src={user?.picture || displayUser?.avatar}
                    alt={displayUser?.name}
                    className="h-12 w-12 rounded-full ring-4 ring-primary-100 hover:ring-primary-200 transition-all cursor-pointer"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-4 py-2"
              >
                <span className="hidden sm:inline">{t('common.logout')}</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Animation */}
        <div className="mb-8 animate-slide-down">
          <h2 className="text-4xl sm:text-5xl font-display font-black mb-3">
            <span className="text-gray-900">{t('dashboard.title', { name: displayUser?.name?.split(' ')[0] || 'User' })}</span>
            <span className="inline-block animate-bounce-slow ml-2">👋</span>
          </h2>
          <p className="text-gray-600 text-lg">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Progress Cards with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
          <ProgressCard
            icon="📚"
            title={t('dashboard.lessonsCompleted')}
            value={metrics.completedLessons}
            color="primary"
            trend={5}
          />
          <ProgressCard
            icon="🎯"
            title={t('dashboard.averageScore')}
            value={`${metrics.averageScore}%`}
            color="success"
            trend={metrics.averageScore > 70 ? 3 : -2}
          />
          <ProgressCard
            icon="⏱️"
            title={t('dashboard.timeSpent')}
            value={`${Math.round(metrics.totalTimeSpent)}m`}
            color="accent"
            trend={8}
          />
        </div>

        {/* Enhanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Recommendations */}
            <RecommendationPanel />
            
            {/* Weekly Activity Chart */}
            <WeeklyActivityChart weeklyData={progressData?.weeklyActivity} />
            
            {/* Recent Achievements */}
            <RecentAchievements achievements={progressData?.recentAchievements} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Learning Streak */}
            <LearningStreak streak={userData?.gamification?.streak} />
            
            {/* Achievement Badges */}
            <AchievementBadges 
              badges={userData?.gamification?.badges} 
              totalPoints={userData?.gamification?.totalPoints}
            />
            
            {/* Quick Actions */}
            <QuickActions 
              lastLesson={progressData?.lastLesson}
              failedQuizzes={progressData?.failedQuizzes}
              recommendations={progressData?.recommendations}
            />
          </div>
        </div>
        
        {/* Second Row - Full Width Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Learning Goals Progress */}
          <LearningGoalsProgress 
            weeklyGoal={userData?.gamification?.weeklyGoal}
            monthlyGoal={userData?.gamification?.monthlyGoal}
            weeklyProgress={progressData?.weeklyProgress}
            monthlyProgress={progressData?.monthlyProgress}
          />
          
          {/* Study Reminders */}
          <StudyReminders 
            nextLessons={progressData?.nextLessons}
            reviewLessons={progressData?.reviewLessons}
          />
        </div>
        
        {/* Third Row - Leaderboard */}
        <div className="mb-8">
          <Leaderboard 
            userRank={leaderboardData?.userRank || progressData?.userRank}
            userPoints={userData?.gamification?.totalPoints}
            topLearners={leaderboardData?.topLearners || progressData?.topLearners}
          />
        </div>

        {/* Call to Action with Gradient */}
        <div className="card-gradient p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>{t('dashboard.readyToLearn')}</span>
                <span className="text-3xl animate-bounce-slow">🚀</span>
              </h3>
              <p className="text-gray-600 text-lg">
                {progressData?.progress && progressData.progress.length > 0
                  ? t('dashboard.continueJourney')
                  : t('dashboard.startJourney')}
              </p>
            </div>
            <button
              onClick={() => navigate('/lessons')}
              className="btn-primary text-lg group/btn whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                {t('dashboard.browseLessons')}
                <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
