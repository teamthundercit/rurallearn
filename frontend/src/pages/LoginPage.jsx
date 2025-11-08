import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary-600 mb-2">
            RuralLearn
          </h1>
          <p className="text-gray-600 text-lg">
            Empowering rural education through personalized learning
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Welcome Back
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
            >
              Log In
            </button>

            <button
              onClick={handleSignup}
              className="w-full bg-white text-primary-600 px-6 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors font-medium text-lg"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="text-2xl mb-1">📚</div>
              <p>Quality Content</p>
            </div>
            <div>
              <div className="text-2xl mb-1">🤖</div>
              <p>AI-Powered</p>
            </div>
            <div>
              <div className="text-2xl mb-1">📱</div>
              <p>Offline Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
