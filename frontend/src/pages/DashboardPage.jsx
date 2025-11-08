import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useApi from '../utils/useApi';
import { getUserProfile, getUserProgress, getLeaderboard } from '../services/api';
import useMoodCheck from '../hooks/useMoodCheck';
import { lazyRoutes } from '../App';
import { preloadRoute } from '../utils/routePreloader';

// Critical components - load immediately
import StickyGlassHeader from '../components/StickyGlassHeader';
import ProgressCard from '../components/ProgressCard';

// Non-critical components - lazy load for better performance
const RecommendationPanel = lazy(() => import('../components/RecommendationPanel'));
const LearningStreak = lazy(() => import('../components/LearningStreak'));
const AchievementBadges = lazy(() => import('../components/AchievementBadges'));
const WeeklyActivityChart = lazy(() => import('../components/WeeklyActivityChart'));
const QuickActions = lazy(() => import('../components/QuickActions'));
const LearningGoalsProgress = lazy(() => import('../components/LearningGoalsProgress'));
const RecentAchievements = lazy(() => import('../components/RecentAchievements'));
const StudyReminders = lazy(() => import('../components/StudyReminders'));
const Leaderboard = lazy(() => import('../components/Leaderboard'));
const MoodCheckModal = lazy(() => import('../components/MoodCheckModal'));

const DashboardPage = () => {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const api = useApi();
  const { t } = useTranslation();
  const { shouldShowMoodCheck, recordMoodCheck } = useMoodCheck();
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMoodCheck, setShowMoodCheck] = useState(false);

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

  // MoodCheck: Show modal after dashboard loads
  useEffect(() => {
    if (!loading && userData && shouldShowMoodCheck()) {
      // Delay slightly to let dashboard render first
      const timer = setTimeout(() => {
        setShowMoodCheck(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, userData, shouldShowMoodCheck]);

  const handleMoodCheckResult = (result) => {
    recordMoodCheck();
    
    if (!result.readyToLearn && !result.skipped) {
      // User needs a refresh - redirect to refresh page
      navigate('/refresh');
    }
    // If ready to learn or skipped, just close modal and stay on dashboard
  };

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
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" aria-hidden="true"></div>
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
    <>
      {/* MoodCheck Modal - Lazy loaded */}
      <Suspense fallback={null}>
        <MoodCheckModal
          isOpen={showMoodCheck}
          onClose={() => setShowMoodCheck(false)}
          onResult={handleMoodCheckResult}
        />
      </Suspense>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Sticky Glass Header */}
        <StickyGlassHeader 
          user={user}
          displayUser={displayUser}
          onLogout={handleLogout}
        />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Animation */}
        <div className="mb-8 animate-slide-down">
          <h2 className="text-4xl sm:text-5xl font-display font-black text-gradient-animate mb-3">
            <span>{t('dashboard.title', { name: displayUser?.name?.split(' ')[0] || 'User' })}</span>
            <span className="inline-block animate-bounce-slow ml-2">👋</span>
          </h2>
          <p className="text-gray-600 text-lg">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Holographic Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" role="region" aria-label="Learning progress overview">
          <ProgressCard
            icon="📚"
            title={t('dashboard.lessonsCompleted')}
            value={metrics.completedLessons}
            total={progressData?.progress?.length || 100}
            color={{ from: 'cyan-400', to: 'blue-500' }}
            trend={5}
            animation="scale"
          />
          <ProgressCard
            icon="🔥"
            title="Study Streak"
            value={`${userData?.gamification?.streak || 0} days`}
            color={{ from: 'violet-400', to: 'fuchsia-500' }}
            trend={userData?.gamification?.streak > 3 ? 8 : -2}
            animation="pulse"
          />
          <ProgressCard
            icon="⭐"
            title="Points Earned"
            value={userData?.gamification?.totalPoints || 0}
            color={{ from: 'amber-400', to: 'yellow-500' }}
            trend={12}
            animation="tilt"
          />
          <ProgressCard
            icon="🏆"
            title="Achievements"
            value={userData?.gamification?.badges?.length || 0}
            total={20}
            color={{ from: 'emerald-400', to: 'teal-500' }}
            trend={userData?.gamification?.badges?.length > 5 ? 10 : 0}
            animation="scale"
          />
        </div>

        {/* Enhanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Recommendations - Lazy loaded */}
            <Suspense fallback={<div className="card h-64 animate-pulse" />}>
              <RecommendationPanel />
            </Suspense>
            
            {/* Weekly Activity Chart - Lazy loaded */}
            <Suspense fallback={<div className="card h-64 animate-pulse" />}>
              <WeeklyActivityChart weeklyData={progressData?.weeklyActivity} />
            </Suspense>
            
            {/* Recent Achievements - Lazy loaded */}
            <Suspense fallback={<div className="card h-48 animate-pulse" />}>
              <RecentAchievements achievements={progressData?.recentAchievements} />
            </Suspense>
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Learning Streak - Lazy loaded */}
            <Suspense fallback={<div className="card h-32 animate-pulse" />}>
              <LearningStreak streak={userData?.gamification?.streak} />
            </Suspense>
            
            {/* Achievement Badges - Lazy loaded */}
            <Suspense fallback={<div className="card h-48 animate-pulse" />}>
              <AchievementBadges 
                badges={userData?.gamification?.badges} 
                totalPoints={userData?.gamification?.totalPoints}
              />
            </Suspense>
            
            {/* Quick Actions - Lazy loaded */}
            <Suspense fallback={<div className="card h-40 animate-pulse" />}>
              <QuickActions 
                lastLesson={progressData?.lastLesson}
                failedQuizzes={progressData?.failedQuizzes}
                recommendations={progressData?.recommendations}
              />
            </Suspense>
          </div>
        </div>
        
        {/* Second Row - Full Width Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Learning Goals Progress - Lazy loaded */}
          <Suspense fallback={<div className="card h-48 animate-pulse" />}>
            <LearningGoalsProgress 
              weeklyGoal={userData?.gamification?.weeklyGoal}
              monthlyGoal={userData?.gamification?.monthlyGoal}
              weeklyProgress={progressData?.weeklyProgress}
              monthlyProgress={progressData?.monthlyProgress}
            />
          </Suspense>
          
          {/* Study Reminders - Lazy loaded */}
          <Suspense fallback={<div className="card h-48 animate-pulse" />}>
            <StudyReminders 
              nextLessons={progressData?.nextLessons}
              reviewLessons={progressData?.reviewLessons}
            />
          </Suspense>
        </div>
        
        {/* Third Row - Leaderboard - Lazy loaded */}
        <div className="mb-8">
          <Suspense fallback={<div className="card h-64 animate-pulse" />}>
            <Leaderboard 
              userRank={leaderboardData?.userRank || progressData?.userRank}
              userPoints={userData?.gamification?.totalPoints}
              topLearners={leaderboardData?.topLearners || progressData?.topLearners}
            />
          </Suspense>
        </div>

        {/* Call to Action with Gradient */}
        <div className="card-gradient p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-gradient-animate mb-2 flex items-center gap-2">
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
              onMouseEnter={() => preloadRoute(lazyRoutes.LessonsListPage, 'LessonsListPage')}
              onFocus={() => preloadRoute(lazyRoutes.LessonsListPage, 'LessonsListPage')}
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
    </>
  );
};

export default DashboardPage;
