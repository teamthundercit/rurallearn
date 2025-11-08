/**
 * Frontend Integration Tests
 * Tests component interactions and user flows
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

// Mock Auth0
const mockAuth0 = {
  isAuthenticated: true,
  user: {
    email: 'test@example.com',
    name: 'Test User'
  },
  isLoading: false,
  loginWithRedirect: jest.fn(),
  logout: jest.fn(),
  getAccessTokenSilently: jest.fn(() => Promise.resolve('mock-token'))
};

jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: () => mockAuth0,
  Auth0Provider: ({ children }) => children
}));

// Mock API calls
jest.mock('../services/api', () => ({
  getUserProfile: jest.fn(() => Promise.resolve({
    data: {
      success: true,
      data: {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'student'
      }
    }
  })),
  getLessons: jest.fn(() => Promise.resolve({
    data: {
      success: true,
      data: [
        {
          _id: 'lesson1',
          title: 'Test Lesson',
          description: 'Test Description',
          difficulty: 'beginner'
        }
      ]
    }
  })),
  getLesson: jest.fn(() => Promise.resolve({
    data: {
      success: true,
      data: {
        _id: 'lesson1',
        title: 'Test Lesson',
        content: { type: 'text', text: 'Test content' },
        quiz: {
          questions: [
            {
              question: 'Test question?',
              options: ['A', 'B', 'C', 'D'],
              correctAnswer: 0,
              explanation: 'Test explanation'
            }
          ]
        }
      }
    }
  })),
  getProgress: jest.fn(() => Promise.resolve({
    data: {
      success: true,
      data: []
    }
  })),
  recordLessonCompletion: jest.fn(() => Promise.resolve({
    data: { success: true, data: {} }
  })),
  submitQuiz: jest.fn(() => Promise.resolve({
    data: { success: true, data: { quizScore: 100 } }
  })),
  getRecommendations: jest.fn(() => Promise.resolve({
    data: {
      success: true,
      data: {
        recommendations: ['Lesson 2', 'Lesson 3']
      }
    }
  }))
}));

describe('Frontend Integration Tests', () => {
  
  describe('Authentication Flow', () => {
    test('should render login page for unauthenticated users', () => {
      const LoginPage = require('../pages/LoginPage').default;
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      expect(screen.getByText(/RuralLearn/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard Integration', () => {
    test('should display user profile and progress', async () => {
      const DashboardPage = require('../pages/DashboardPage').default;
      
      render(
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Viewing Flow', () => {
    test('should display lesson content', async () => {
      const LessonPage = require('../pages/LessonPage').default;
      
      // Mock useParams
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useParams: () => ({ id: 'lesson1' })
      }));

      render(
        <BrowserRouter>
          <LessonPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Test Lesson/i)).toBeInTheDocument();
      });
    });
  });

  describe('Offline Functionality', () => {
    test('should detect offline status', () => {
      const OfflineIndicator = require('../components/OfflineIndicator').default;
      
      // Mock navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });

      render(<OfflineIndicator />);
      
      expect(screen.getByText(/offline/i)).toBeInTheDocument();
    });
  });

  describe('Progress Tracking', () => {
    test('should display progress cards', async () => {
      const ProgressCard = require('../components/ProgressCard').default;
      
      const mockProgress = {
        lessonTitle: 'Test Lesson',
        status: 'completed',
        quizScore: 85,
        timeSpent: 30
      };

      render(<ProgressCard progress={mockProgress} />);

      expect(screen.getByText(/Test Lesson/i)).toBeInTheDocument();
      expect(screen.getByText(/85/)).toBeInTheDocument();
    });
  });

  describe('Quiz Component', () => {
    test('should render quiz questions', () => {
      const QuizComponent = require('../components/QuizComponent').default;
      
      const mockQuiz = {
        questions: [
          {
            question: 'What is 2+2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: 1,
            explanation: 'Basic math'
          }
        ]
      };

      const mockOnComplete = jest.fn();

      render(
        <QuizComponent 
          quiz={mockQuiz} 
          onQuizComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/What is 2\+2\?/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should display error messages gracefully', async () => {
      const api = require('../services/api');
      api.getLessons.mockRejectedValueOnce(new Error('Network error'));

      const LessonsListPage = require('../pages/LessonsListPage').default;
      
      render(
        <BrowserRouter>
          <LessonsListPage />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});
