import Quiz from "@/components/Quiz";
import Repetition from "@/components/Repetition";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-white">
      {/* <Quiz topic="Nuclear Fusion" /> */}
      <Repetition failedAnswers={[
        {
          question: "What is the primary function of the mitochondria in a cell?",
          correctAnswer: "To produce energy",
          userAnswer: "To store genetic information",
          rating: 0 // Add this line
        },
        {
          question: "Which planet is known as the Red Planet?",
          correctAnswer: "Mars",
          userAnswer: "Jupiter",
          rating: 0 // Add this line
        },
        {
          question: "Who wrote 'Romeo and Juliet",
          correctAnswer: "William Shakespeare",
          userAnswer: "Charles Dickens",
          rating: 0 // Add this line
        }
      ]} />
    </div>
  );
}
