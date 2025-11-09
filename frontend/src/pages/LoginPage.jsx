import React, { useEffect, lazy, Suspense } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { lazyRoutes } from '../App';
import { preloadRoute } from '../utils/routePreloader';

// Lazy load animation components for better performance
const ParticleBackground = lazy(() => import('../components/ParticleBackground'));
const AnimatedLogo = lazy(() => import('../components/AnimatedLogo'));
const FeatureTile = lazy(() => import('../components/FeatureTile'));
const PlatformStats = lazy(() => import('../components/PlatformStats'));
const GlowButton = lazy(() => import('../components/GlowButton'));

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/dashboard'
      },
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });
  };

  const handleSignup = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/dashboard'
      },
      authorizationParams: {
        screen_hint: 'signup',
        redirect_uri: window.location.origin
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-900 dark:bg-gray-950">
        <div className="text-center" role="status" aria-live="polite">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 dark:border-blue-500 mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-gray-400 dark:text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight-900 dark:bg-gray-950 px-4 py-12 relative overflow-hidden">
      {/* Lazy load Particle Background with Suspense */}
      <Suspense fallback={<div className="absolute inset-0 bg-midnight-900" />}>
        <ParticleBackground />
      </Suspense>

      <div className="max-w-6xl w-full relative z-10">
        {/* Animated Logo with Suspense */}
        <div className="text-center mb-12">
          <Suspense fallback={<div className="h-20" />}>
            <AnimatedLogo />
          </Suspense>
          <p className="text-gray-400 text-lg mt-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
            Personalized adaptive learning powered by AI
          </p>
        </div>

        {/* Feature Tiles Grid with Suspense */}
        <Suspense fallback={<div className="h-48" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" role="list" aria-label="Platform features">
            <FeatureTile
              icon="📚"
              title="Quality Content"
              description="Expert-curated lessons designed for effective learning"
            />
            <FeatureTile
              icon="🤖"
              title="AI-Powered"
              description="Personalized recommendations based on your progress"
            />
            <FeatureTile
              icon="📱"
              title="Offline Ready"
              description="Learn anywhere, anytime with offline support"
            />
          </div>
        </Suspense>

        {/* Platform Stats with Suspense */}
        <div className="mb-12">
          <Suspense fallback={<div className="h-16" />}>
            <PlatformStats />
          </Suspense>
        </div>

        {/* Login Button with Suspense */}
        <div className="flex flex-col items-center gap-4">
          <Suspense fallback={<div className="h-14 w-48 bg-blue-600/20 rounded-xl animate-pulse" />}>
            <GlowButton 
              onClick={handleLogin} 
              onMouseEnter={() => preloadRoute(lazyRoutes.DashboardPage, 'DashboardPage')}
              onFocus={() => preloadRoute(lazyRoutes.DashboardPage, 'DashboardPage')}
              ariaLabel="Start learning - Log in to your account"
            >
              Start Learning
            </GlowButton>
          </Suspense>
          
          <button
            onClick={handleSignup}
            onMouseEnter={() => preloadRoute(lazyRoutes.DashboardPage, 'DashboardPage')}
            onFocus={() => preloadRoute(lazyRoutes.DashboardPage, 'DashboardPage')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
            aria-label="Sign up for a new account"
          >
            Don't have an account? <span className="text-blue-400 font-semibold">Sign up</span>
          </button>
        </div>

        {/* Terms */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            By continuing, you agree to our{' '}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">Terms</span>
            {' '}and{' '}
            <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
