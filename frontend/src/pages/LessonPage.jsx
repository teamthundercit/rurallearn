import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getLessonById, submitQuiz, recordLessonCompletion } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import QuizComponent from '../components/QuizComponent';
import Toast from '../components/Toast';

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [toast, setToast] = useState(null);
  
  const lessonContentRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }
        });

        const response = await getLessonById(token, lessonId);
        setLesson(response.data?.lesson || response.lesson);
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError(err.message || 'Failed to load lesson. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, getAccessTokenSilently]);

  const handleCompleteLesson = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }
      });

      const timeSpent = Math.round((Date.now() - startTime) / 60000); // Convert to minutes
      await recordLessonCompletion(token, lessonId, timeSpent);
      
      showToast('Lesson completed successfully! 🎉', 'success');
      
      // Show quiz if available
      if (lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0) {
        setShowQuiz(true);
        // Scroll to quiz
        setTimeout(() => {
          lessonContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      } else {
        // No quiz, navigate back after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
      showToast('Failed to record lesson completion. Please try again.', 'error');
    }
  };

  const handleQuizSubmit = async (answers, results) => {
    try {
      setIsSubmittingQuiz(true);

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }
      });

      await submitQuiz(token, lessonId, answers);
      setQuizSubmitted(true);
      
      // Show success message based on score
      const message = results.score >= 70 
        ? `Great job! Quiz submitted with ${results.score}% score! 🎉`
        : `Quiz submitted. Your score: ${results.score}%. Keep practicing! 📚`;
      
      showToast(message, results.score >= 70 ? 'success' : 'info');
    } catch (err) {
      console.error('Error submitting quiz:', err);
      showToast('Failed to submit quiz. Please try again.', 'error');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleVideoProgress = (currentTime, duration) => {
    // Track video progress if needed
    // Could be used for analytics or completion tracking
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-xl mr-2">←</span>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-bold text-primary-600">RuralLearn</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={lessonContentRef}>
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-3">
            {lesson.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
              </span>
            )}
            {lesson.tags && lesson.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {lesson.title}
          </h1>
          
          {lesson.description && (
            <p className="text-lg text-gray-600">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Video Content */}
          {lesson.content?.type === 'video' && lesson.content?.videoUrl && (
            <div className="mb-8">
              <VideoPlayer
                videoUrl={lesson.content.videoUrl}
                onProgress={handleVideoProgress}
              />
            </div>
          )}

          {/* Mixed Content - Video */}
          {lesson.content?.type === 'mixed' && lesson.content?.videoUrl && (
            <div className="mb-8">
              <VideoPlayer
                videoUrl={lesson.content.videoUrl}
                onProgress={handleVideoProgress}
              />
            </div>
          )}

          {/* Text Content */}
          {(lesson.content?.type === 'text' || lesson.content?.type === 'mixed') && lesson.content?.text && (
            <div className="prose max-w-none">
              <div
                className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: lesson.content.text.replace(/\n/g, '<br />') }}
              />
            </div>
          )}

          {/* Complete Lesson Button */}
          {!showQuiz && !quizSubmitted && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={handleCompleteLesson}
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
              >
                {lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0
                  ? 'Complete Lesson & Take Quiz'
                  : 'Complete Lesson'}
              </button>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        {showQuiz && lesson.quiz && (
          <div className="mb-8">
            <QuizComponent
              quiz={lesson.quiz}
              onSubmit={handleQuizSubmit}
              isSubmitting={isSubmittingQuiz}
            />
            
            {quizSubmitted && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
