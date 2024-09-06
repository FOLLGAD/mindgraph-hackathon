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
  jsonFile: string;
}

const Quiz: React.FC<QuizProps> = ({ jsonFile }) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    fetch(jsonFile)
      .then(response => response.json())
      .then(data => setQuestion(data));

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        setAlert('Question skipped');
        loadNextQuestion();
      } else if (['1', '2', '3', '4'].includes(event.key)) {
        const answerKey = String.fromCharCode(64 + parseInt(event.key));
        handleAnswerSelect(answerKey);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jsonFile]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (question) {
      if (answer === question.correctAnswer) {
        setAlert('Correct answer!');
      } else {
        setAlert('Wrong answer');
      }
    }
    setTimeout(loadNextQuestion, 1500);
  };

  const loadNextQuestion = () => {
    setSelectedAnswer(null);
    setAlert(null);
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-container bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
      {alert && (
        <div className="alert bg-[#6677FF] text-white p-4 rounded-lg mb-4">
          {alert}
        </div>
      )}
      <ul className="space-y-4">
        {Object.entries(question.options).map(([key, value], index) => (
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
