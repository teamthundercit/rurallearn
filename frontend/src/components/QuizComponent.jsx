import React, { useState } from 'react';

const QuizComponent = ({ quiz, onSubmit, isSubmitting }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No quiz available for this lesson.</p>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Time! 📝</h3>
        <p className="text-gray-600">
          Test your understanding of this lesson
        </p>
      </div>

      {/* Results Summary */}
      {showResults && results && (
        <div className={`mb-6 p-6 rounded-lg ${
          results.score >= 70 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {results.score >= 70 ? '🎉' : '📚'}
            </div>
            <h4 className="text-2xl font-bold mb-2">
              {results.score >= 70 ? 'Great Job!' : 'Keep Learning!'}
            </h4>
            <p className="text-xl font-semibold mb-1">
              Score: {results.score}%
            </p>
            <p className="text-gray-700">
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
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Question {questionIndex + 1}
                </h4>
                <p className="text-gray-800">{question.question}</p>
              </div>

              <div className="space-y-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isCorrect = optionIndex === question.correctAnswer;
                  
                  let optionClass = 'border-gray-300 bg-white hover:bg-gray-100';
                  
                  if (showResults) {
                    if (isCorrect) {
                      optionClass = 'border-green-500 bg-green-100';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'border-red-500 bg-red-100';
                    } else {
                      optionClass = 'border-gray-300 bg-white';
                    }
                  } else if (isSelected) {
                    optionClass = 'border-primary-500 bg-primary-50';
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
                          isSelected ? 'border-primary-600' : 'border-gray-400'
                        }`}>
                          {isSelected && (
                            <div className="w-3 h-3 rounded-full bg-primary-600" />
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showResults && isCorrect && (
                          <span className="text-green-600 font-bold ml-2">✓</span>
                        )}
                        {showResults && isSelected && !isCorrect && (
                          <span className="text-red-600 font-bold ml-2">✗</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Show explanation after submission */}
              {showResults && question.explanation && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                  <p className="text-sm text-blue-800">{question.explanation}</p>
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
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              Object.keys(selectedAnswers).length === quiz.questions.length
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="px-6 py-3 rounded-lg font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            Retry Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
