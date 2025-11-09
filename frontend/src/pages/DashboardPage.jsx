import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Flame, Star, Trophy } from 'lucide-react';
import useApi from '../utils/useApi';
import { getUserProfile, getUserProgress, getLeaderboard } from '../services/api';
import useMoodCheck from '../hooks/useMoodCheck';
import { lazyRoutes } from '../App';
import { preloadRoute } from '../utils/routePreloader';

// Critical components - load immediately
import StickyGlassHeader from '../components/StickyGlassHeader';
import ProgressCard from '../components/ProgressCard';
import AttractiveSpinner from '../components/AttractiveSpinner';

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
      <div className="min-h-screen flex items-center justify-center bg-midnight-900">
        <div role="status" aria-live="polite">
          <AttractiveSpinner size="lg" text="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-900">
        <div className="text-center p-8 glass-neon-blue rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

      <div className="min-h-screen bg-midnight-900 transition-colors duration-300">
        {/* Sticky Glass Header */}
        <StickyGlassHeader 
          user={user}
          displayUser={displayUser}
          onLogout={handleLogout}
        />

      {/* Main Content - Midnight Theme */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-1">
            {t('dashboard.title', { name: displayUser?.name?.split(' ')[0] || 'User' })} 👋
          </h1>
          <p className="text-gray-400 text-sm">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Cards - With Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" role="region" aria-label="Learning progress overview">
          <ProgressCard
            icon={<BookOpen className="w-6 h-6" strokeWidth={2} />}
            title={t('dashboard.lessonsCompleted')}
            value={metrics.completedLessons}
            total={progressData?.progress?.length || 100}
            color={{ from: 'cyan-400', to: 'blue-500' }}
            trend={5}
            animation="scale"
          />
          <ProgressCard
            icon={<Flame className="w-6 h-6" strokeWidth={2} />}
            title="Study Streak"
            value={`${userData?.gamification?.streak || 0} days`}
            color={{ from: 'violet-400', to: 'fuchsia-500' }}
            trend={userData?.gamification?.streak > 3 ? 8 : -2}
            animation="pulse"
          />
          <ProgressCard
            icon={<Star className="w-6 h-6" strokeWidth={2} />}
            title="Points Earned"
            value={userData?.gamification?.totalPoints || 0}
            color={{ from: 'amber-400', to: 'yellow-500' }}
            trend={12}
            animation="tilt"
          />
          <ProgressCard
            icon={<Trophy className="w-6 h-6" strokeWidth={2} />}
            title="Achievements"
            value={userData?.gamification?.badges?.length || 0}
            total={20}
            color={{ from: 'emerald-400', to: 'teal-500' }}
            trend={userData?.gamification?.badges?.length > 5 ? 10 : 0}
            animation="scale"
          />
        </div>

        {/* Main Layout: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* MAIN CONTENT AREA (3/4 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Recommendations - Primary Feature */}
            <Suspense fallback={
              <div className="glass-neon-blue rounded-xl h-64 border border-white/10 flex items-center justify-center">
                <AttractiveSpinner size="md" text="" />
              </div>
            }>
              <RecommendationPanel />
            </Suspense>
            
            {/* Weekly Activity Chart */}
            <Suspense fallback={
              <div className="glass-neon-blue rounded-xl h-64 border border-white/10 flex items-center justify-center">
                <AttractiveSpinner size="md" text="" />
              </div>
            }>
              <WeeklyActivityChart weeklyData={progressData?.weeklyActivity} />
            </Suspense>
            
            {/* Learning Goals Progress */}
            <Suspense fallback={
              <div className="glass-neon-blue rounded-xl h-48 border border-white/10 flex items-center justify-center">
                <AttractiveSpinner size="md" text="" />
              </div>
            }>
              <LearningGoalsProgress 
                weeklyGoal={userData?.gamification?.weeklyGoal}
                monthlyGoal={userData?.gamification?.monthlyGoal}
                weeklyProgress={progressData?.weeklyProgress}
                monthlyProgress={progressData?.monthlyProgress}
              />
            </Suspense>
            
            {/* Recent Achievements */}
            <Suspense fallback={
              <div className="glass-neon-blue rounded-xl h-48 border border-white/10 flex items-center justify-center">
                <AttractiveSpinner size="md" text="" />
              </div>
            }>
              <RecentAchievements achievements={progressData?.recentAchievements} />
            </Suspense>
            
            {/* Leaderboard */}
            <Suspense fallback={
              <div className="glass-neon-blue rounded-xl h-64 border border-white/10 flex items-center justify-center">
                <AttractiveSpinner size="md" text="" />
              </div>
            }>
              <Leaderboard 
                userRank={leaderboardData?.userRank || progressData?.userRank}
                userPoints={userData?.gamification?.totalPoints}
                topLearners={leaderboardData?.topLearners || progressData?.topLearners}
              />
            </Suspense>
          </div>
          
          {/* SIDEBAR (1/4 width) */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Learning Streak */}
              <Suspense fallback={
                <div className="glass-neon-blue rounded-xl h-32 border border-white/10 flex items-center justify-center">
                  <AttractiveSpinner size="sm" text="" />
                </div>
              }>
                <LearningStreak streak={userData?.gamification?.streak} />
              </Suspense>
              
              {/* Achievement Badges */}
              <Suspense fallback={
                <div className="glass-neon-blue rounded-xl h-48 border border-white/10 flex items-center justify-center">
                  <AttractiveSpinner size="sm" text="" />
                </div>
              }>
                <AchievementBadges 
                  badges={userData?.gamification?.badges} 
                  totalPoints={userData?.gamification?.totalPoints}
                />
              </Suspense>
              
              {/* Quick Actions */}
              <Suspense fallback={
                <div className="glass-neon-blue rounded-xl h-40 border border-white/10 flex items-center justify-center">
                  <AttractiveSpinner size="sm" text="" />
                </div>
              }>
                <QuickActions 
                  lastLesson={progressData?.lastLesson}
                  failedQuizzes={progressData?.failedQuizzes}
                  recommendations={progressData?.recommendations}
                />
              </Suspense>
              
              {/* Study Reminders */}
              <Suspense fallback={
                <div className="glass-neon-blue rounded-xl h-48 border border-white/10 flex items-center justify-center">
                  <AttractiveSpinner size="sm" text="" />
                </div>
              }>
                <StudyReminders 
                  nextLessons={progressData?.nextLessons}
                  reviewLessons={progressData?.reviewLessons}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* CTA Card - Midnight Theme */}
        <div className="glass-neon-blue rounded-xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-1">
                {t('dashboard.readyToLearn')} 🚀
              </h3>
              <p className="text-gray-300 text-sm">
                {progressData?.progress && progressData.progress.length > 0
                  ? t('dashboard.continueJourney')
                  : t('dashboard.startJourney')}
              </p>
            </div>
            <button
              onClick={() => navigate('/lessons')}
              onMouseEnter={() => preloadRoute(lazyRoutes.LessonsListPage, 'LessonsListPage')}
              onFocus={() => preloadRoute(lazyRoutes.LessonsListPage, 'LessonsListPage')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg whitespace-nowrap"
            >
              {t('dashboard.browseLessons')} →
            </button>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default DashboardPage;
