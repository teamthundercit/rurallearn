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
  const [contentSections, setContentSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  
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
        const lessonData = response.data?.lesson || response.lesson;
        setLesson(lessonData);
        
        // Split text content into sections for better learning experience
        if (lessonData?.content?.text) {
          const paragraphs = lessonData.content.text.split('\n').filter(p => p.trim());
          const sections = [];
          
          // Group paragraphs into sections (3-4 paragraphs per section)
          for (let i = 0; i < paragraphs.length; i += 3) {
            sections.push({
              content: paragraphs.slice(i, i + 3).join('\n'),
              completed: false
            });
          }
          
          setContentSections(sections);
        }
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError(err.message || 'Failed to load lesson. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, getAccessTokenSilently]);

  const handleNextSection = () => {
    if (currentSection < contentSections.length - 1) {
      setCurrentSection(currentSection + 1);
      // Smooth scroll to top of content
      setTimeout(() => {
        lessonContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      // Smooth scroll to top of content
      setTimeout(() => {
        lessonContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

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
        // Scroll to quiz smoothly
        setTimeout(() => {
          window.scrollTo({ 
            top: document.documentElement.scrollHeight, 
            behavior: 'smooth' 
          });
        }, 300);
      } else {
        // No quiz, navigate back after a short delay with refresh flag
        setTimeout(() => {
          navigate('/dashboard', { state: { refresh: true } });
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
      
      // Scroll to top to show the return button
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
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
      <div className="min-h-screen flex items-center justify-center bg-midnight-900">
        <div className="text-center animate-scale-in">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-900">
        <div className="glass-neon-blue max-w-md animate-scale-in border border-white/10 rounded-xl p-8">
          <div className="text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-display font-bold text-red-400 mb-4">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
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
      <div className="min-h-screen flex items-center justify-center bg-midnight-900">
        <div className="glass-neon-blue animate-scale-in border border-white/10 rounded-xl p-8">
          <div className="text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h2 className="text-2xl font-display font-bold text-white mb-4">Lesson Not Found</h2>
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
    <div className="min-h-screen bg-midnight-900">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Modern Header */}
      <header className="sticky-glass border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-all group"
            >
              <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎓</span>
              </div>
              <h1 className="text-xl font-display font-black text-neon-animate">EduAdapt</h1>
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                lesson.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                lesson.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🌿' : '🌳'}
                {' '}{lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
              </span>
            )}
            {lesson.tags && lesson.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white mb-4">
            {lesson.title}
          </h1>
          
          {lesson.description && (
            <p className="text-lg text-gray-300 leading-relaxed">
              {lesson.description}
            </p>
          )}

          {/* Content Attribution */}
          {lesson.source && lesson.source.name !== 'Original' && (
            <div className="mt-4 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-300 mb-1">
                    Content Source
                  </p>
                  <p className="text-sm text-gray-300">
                    {lesson.source.attribution}
                  </p>
                  {lesson.source.url && (
                    <a
                      href={lesson.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 underline mt-1 inline-block"
                    >
                      View original source →
                    </a>
                  )}
                  {lesson.source.license && (
                    <p className="text-xs text-gray-400 mt-1">
                      License: {lesson.source.license}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Content */}
        <div className="glass-neon-blue p-8 mb-8 animate-scale-in border border-white/10 rounded-xl">
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

          {/* Text Content - Sectioned for better learning */}
          {(lesson.content?.type === 'text' || lesson.content?.type === 'mixed') && lesson.content?.text && (
            <div className="prose prose-lg max-w-none">
              {contentSections.length > 1 ? (
                <>
                  {/* Progress indicator */}
                  <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">
                        Section {currentSection + 1} of {contentSections.length}
                      </span>
                      <span className="text-sm text-blue-300">
                        {Math.round(((currentSection + 1) / contentSections.length) * 100)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentSection + 1) / contentSections.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Current section content */}
                  <div className="text-gray-200 leading-relaxed mb-6">
                    {contentSections[currentSection].content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-3 justify-between items-center pt-4 border-t border-white/10">
                    <button
                      onClick={handlePreviousSection}
                      disabled={currentSection === 0}
                      className={`bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                        currentSection === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    {currentSection < contentSections.length - 1 ? (
                      <button
                        onClick={handleNextSection}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
                      >
                        Next Section
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <div className="text-sm text-green-400 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        All sections completed!
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Single section - show all content
                <div className="text-gray-200 leading-relaxed">
                  {lesson.content.text.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Complete Lesson Button */}
          {!showQuiz && !quizSubmitted && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                onClick={handleCompleteLesson}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all w-full text-lg group"
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
              <div className="mt-6 animate-scale-in">
                <div className="glass-neon-blue p-6 rounded-xl border border-white/10 mb-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Quiz Submitted Successfully!
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Your progress has been saved. Great work!
                    </p>
                    <button
                      onClick={() => navigate('/dashboard', { state: { refresh: true } })}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-lg inline-flex items-center gap-2 shadow-lg"
                    >
                      Return to Dashboard
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonPage;
