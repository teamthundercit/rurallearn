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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center animate-scale-in">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="card-gradient max-w-md animate-scale-in">
          <div className="text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-display font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="card-gradient animate-scale-in">
          <div className="text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Lesson Not Found</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Modern Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all group"
            >
              <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎓</span>
              </div>
              <h1 className="text-xl font-display font-black text-gradient">EduAdapt</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={lessonContentRef}>
        {/* Lesson Header */}
        <div className="mb-8 animate-slide-down">
          <div className="flex items-center flex-wrap gap-2 mb-4">
            {lesson.difficulty && (
              <span className={`badge ${
                lesson.difficulty === 'beginner' ? 'bg-success-100 text-success-800 border-success-200' :
                lesson.difficulty === 'intermediate' ? 'bg-accent-100 text-accent-800 border-accent-200' :
                'bg-red-100 text-red-800 border-red-200'
              }`}>
                {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🌿' : '🌳'}
                {' '}{lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
              </span>
            )}
            {lesson.tags && lesson.tags.map((tag, index) => (
              <span
                key={index}
                className="badge badge-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-display font-black text-gray-900 mb-4">
            {lesson.title}
          </h1>
          
          {lesson.description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Lesson Content */}
        <div className="card-gradient p-8 mb-8 animate-scale-in">
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

          {/* Text Content - Fixed rendering issue */}
          {(lesson.content?.type === 'text' || lesson.content?.type === 'mixed') && lesson.content?.text && (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed">
                {lesson.content.text.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Complete Lesson Button */}
          {!showQuiz && !quizSubmitted && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={handleCompleteLesson}
                className="btn-primary w-full text-lg group"
              >
                <span className="flex items-center justify-center gap-2">
                  {lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0
                    ? 'Complete Lesson & Take Quiz'
                    : 'Complete Lesson'}
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        {showQuiz && lesson.quiz && (
          <div className="mb-8 animate-slide-up">
            <QuizComponent
              quiz={lesson.quiz}
              onSubmit={handleQuizSubmit}
              isSubmitting={isSubmittingQuiz}
            />
            
            {quizSubmitted && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary text-lg"
                >
                  <span className="flex items-center gap-2">
                    Return to Dashboard
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </span>
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
