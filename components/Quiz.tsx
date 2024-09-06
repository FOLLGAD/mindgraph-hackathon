"use client"

import React, { useState, useEffect } from 'react';
import { MdOutlineSpaceBar } from "react-icons/md";

interface QuizQuestion {
  question: string;
  options: {
    [key: string]: string;
  };
  correctAnswer: string;
}

interface QuizProps {
  topic: string;
}

const Quiz: React.FC<QuizProps> = ({ topic }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: topic }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid response format');
        }
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(`Failed to load questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [topic]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      if (answer === currentQuestion.correctAnswer) {
        setAlert('Correct answer!');
        setScore(prevScore => prevScore + 1);
      } else {
        setAlert('Wrong answer');
      }
    }
    setTimeout(loadNextQuestion, 1500);
  };

  const loadNextQuestion = () => {
    setSelectedAnswer(null);
    setAlert(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setAlert(null);
    setError(null);
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="quiz-container bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Error</h2>
        <p className="text-red-500">{error}</p>
        <button
          className="bg-[#6677FF] text-white p-4 rounded-lg cursor-pointer hover:bg-[#5566EE] mt-4"
          onClick={restartQuiz}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Quiz Completed!</h2>
        <p className="text-xl mb-4">Your score: {score} out of {questions.length}</p>
        <p className="text-lg mb-6">Percentage: {((score / questions.length) * 100).toFixed(2)}%</p>
        <button
          className="bg-[#6677FF] text-white p-4 rounded-lg cursor-pointer hover:bg-[#5566EE]"
          onClick={restartQuiz}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-white">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
      <p className="text-sm mb-4">Question {currentQuestionIndex + 1} of {questions.length}</p>
      {alert && (
        <div className="alert bg-[#6677FF] text-white p-4 rounded-lg mb-4">
          {alert}
        </div>
      )}
      <ul className="space-y-4">
        {Object.entries(currentQuestion.options).map(([key, value], index) => (
          <li
            key={key}
            className={`option p-4 rounded-lg cursor-pointer transition-colors
              ${selectedAnswer === key ? 'bg-[#6677FF] text-white' : 'bg-[#333333] hover:bg-[#444444]'}`}
            onClick={() => handleAnswerSelect(key)}
          >
            <span className="mr-3 font-bold">{index + 1}</span>
            {value}
          </li>
        ))}
        <li
          className="flex items-center justify-start option p-4 rounded-lg cursor-pointer transition-colors bg-[#333333] hover:bg-[#444444]"
          onClick={() => {
            setAlert('Question skipped');
            loadNextQuestion();
          }}
        >
          <MdOutlineSpaceBar />
          Skip question
        </li>
      </ul>
    </div>
  );
};

export default Quiz;