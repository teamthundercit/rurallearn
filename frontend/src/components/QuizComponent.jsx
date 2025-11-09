import React, { useState } from 'react';

const QuizComponent = ({ quiz, onSubmit, isSubmitting }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
        <p className="text-yellow-300">No quiz available for this lesson.</p>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (showResults) return; // Don't allow changes after submission
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(
      (_, index) => selectedAnswers[index] === undefined
    );

    if (unansweredQuestions.length > 0) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Calculate score
    let correctCount = 0;
    const questionResults = quiz.questions.map((question, index) => {
      const isCorrect = selectedAnswers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionIndex: index,
        isCorrect,
        selectedAnswer: selectedAnswers[index],
        correctAnswer: question.correctAnswer
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    
    const quizResults = {
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      questionResults
    };

    setResults(quizResults);
    setShowResults(true);

    // Call parent submit handler with answers array
    if (onSubmit) {
      const answersArray = quiz.questions.map((_, index) => selectedAnswers[index]);
      await onSubmit(answersArray, quizResults);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setResults(null);
  };

  return (
    <div className="glass-neon-blue rounded-xl p-6 border border-white/10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Quiz Time! 📝</h3>
        <p className="text-gray-300">
          Test your understanding of this lesson
        </p>
      </div>

      {/* Results Summary */}
      {showResults && results && (
        <div className={`mb-6 p-6 rounded-lg ${
          results.score >= 70 ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'
        }`}>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {results.score >= 70 ? '🎉' : '📚'}
            </div>
            <h4 className="text-2xl font-bold mb-2 text-white">
              {results.score >= 70 ? 'Great Job!' : 'Keep Learning!'}
            </h4>
            <p className="text-xl font-semibold mb-1 text-white">
              Score: {results.score}%
            </p>
            <p className="text-gray-300">
              You got {results.correctCount} out of {results.totalQuestions} questions correct
            </p>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((question, questionIndex) => {
          const isAnswered = selectedAnswers[questionIndex] !== undefined;
          const selectedAnswer = selectedAnswers[questionIndex];
          const questionResult = results?.questionResults.find(r => r.questionIndex === questionIndex);

          return (
            <div
              key={questionIndex}
              className={`p-6 rounded-lg border-2 ${
                showResults
                  ? questionResult?.isCorrect
                    ? 'border-green-500/50 bg-green-500/10'
                    : 'border-red-500/50 bg-red-500/10'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Question {questionIndex + 1}
                </h4>
                <p className="text-gray-200">{question.question}</p>
              </div>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isCorrect = optionIndex === question.correctAnswer;
                  
                  let optionClass = 'border-white/20 bg-white/5 hover:bg-white/10 text-gray-200';
                  
                  if (showResults) {
                    if (isCorrect) {
                      optionClass = 'border-green-500/50 bg-green-500/20 text-green-300';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'border-red-500/50 bg-red-500/20 text-red-300';
                    } else {
                      optionClass = 'border-white/20 bg-white/5 text-gray-300';
                    }
                  } else if (isSelected) {
                    optionClass = 'border-blue-500/50 bg-blue-500/20 text-white';
                  }

                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                      disabled={showResults}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionClass} ${
                        showResults ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          isSelected ? 'border-blue-400' : 'border-gray-500'
                        }`}>
                          {isSelected && (
                            <div className="w-3 h-3 rounded-full bg-blue-400" />
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showResults && isCorrect && (
                          <span className="text-green-400 font-bold ml-2">✓</span>
                        )}
                        {showResults && isSelected && !isCorrect && (
                          <span className="text-red-400 font-bold ml-2">✗</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Show explanation after submission */}
              {showResults && question.explanation && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm font-semibold text-blue-300 mb-1">Explanation:</p>
                  <p className="text-sm text-gray-300">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(selectedAnswers).length !== quiz.questions.length}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              Object.keys(selectedAnswers).length === quiz.questions.length
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-lg font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            Retry Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
