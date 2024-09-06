"use client"

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface FailedAnswer {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  rating: number;
}

interface RepetitionProps {
  failedAnswers: FailedAnswer[];
}

const Repetition: React.FC<RepetitionProps> = ({ failedAnswers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [repetitionSchedule, setRepetitionSchedule] = useState<number[]>([]);
  const [currentRating, setCurrentRating] = useState(0);

  useEffect(() => {
    // Initialize repetition schedule (1 day, 3 days, 7 days, 14 days, 30 days)
    setRepetitionSchedule(failedAnswers.map(() => Date.now() + 86400000));
  }, [failedAnswers]);

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentRating(0);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % failedAnswers.length);
  };

  const handleMarkAsReviewed = () => {
    const newSchedule = [...repetitionSchedule];
    const currentDate = Date.now();
    const nextReviewDate = getNextReviewDate(currentDate, currentIndex);
    newSchedule[currentIndex] = nextReviewDate;
    setRepetitionSchedule(newSchedule);
    handleNextQuestion();
  };

  const handleRating = (rating: number) => {
    setCurrentRating(rating);
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            onClick={() => handleRating(star)}
            className={`cursor-pointer ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const getNextReviewDate = (currentDate: number, index: number): number => {
    const intervals = [1, 3, 7, 14, 30]; // Days
    const reviewCount = Math.floor((currentDate - repetitionSchedule[index]) / 86400000);
    const nextInterval = intervals[Math.min(reviewCount, intervals.length - 1)];
    return currentDate + nextInterval * 86400000;
  };

  const currentQuestion = failedAnswers[currentIndex];

  if (failedAnswers.length === 0) {
    return <div className="text-white">No failed answers to review.</div>;
  }

  return (
    <div className="bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Spaced Repetition Review</h2>
      <div className="mb-4">
        <p className="text-lg mb-2">{currentQuestion.question}</p>
        {showAnswer ? (
          <div>
            <p className="text-green-500 mb-2">{currentQuestion.correctAnswer}</p>
            <p className="text-red-500 mb-4">{currentQuestion.userAnswer}</p>
            <div className="mb-4">
              <p className="mb-2">How well do you know this answer?</p>
              <StarRating rating={currentRating} />
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowAnswer(true)} className="mb-4">
            Show Answer
          </Button>
        )}
      </div>
      <div className="flex justify-between">
        <Button onClick={handleNextQuestion}>Next Question</Button>
        <Button onClick={handleMarkAsReviewed} disabled={!showAnswer || currentRating === 0}>
          Mark as Reviewed
        </Button>
      </div>
    </div>
  );
};

export default Repetition;