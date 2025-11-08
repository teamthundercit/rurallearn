import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent-300/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow mx-auto transform hover:scale-110 transition-transform duration-300">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
          <h1 className="text-6xl font-display font-black mb-3">
            <span className="text-gradient-animate">EduAdapt</span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Personalized adaptive learning powered by AI
          </p>
        </div>

        {/* Main Card */}
        <div className="glass p-8 mb-6 animate-scale-in hover-lift">
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2 text-center">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Continue your learning journey
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="btn-primary w-full text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Log In</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={handleSignup}
              className="btn-secondary w-full text-lg group"
            >
              <span className="flex items-center justify-center gap-2">
                <span>Create Account</span>
                <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              By continuing, you agree to our{' '}
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">Terms</span>
              {' '}and{' '}
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">Privacy Policy</span>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up">
          <div className="glass p-4 text-center hover-lift group cursor-pointer">
            <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">📚</div>
            <p className="text-sm font-semibold text-gray-700">Quality Content</p>
            <p className="text-xs text-gray-500 mt-1">Expert-curated</p>
          </div>
          <div className="glass p-4 text-center hover-lift group cursor-pointer">
            <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">🤖</div>
            <p className="text-sm font-semibold text-gray-700">AI-Powered</p>
            <p className="text-xs text-gray-500 mt-1">Personalized</p>
          </div>
          <div className="glass p-4 text-center hover-lift group cursor-pointer">
            <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">📱</div>
            <p className="text-sm font-semibold text-gray-700">Offline Ready</p>
            <p className="text-xs text-gray-500 mt-1">Learn anywhere</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gradient">1000+</div>
            <div className="text-xs text-gray-600">Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">50+</div>
            <div className="text-xs text-gray-600">Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gradient">95%</div>
            <div className="text-xs text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
