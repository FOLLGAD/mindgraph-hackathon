import { Knowledge } from "./Knowledge";
import { useParams, useRouter } from "next/navigation";
import { SkillTree } from "../SkillTree";
import Link from "next/link";
import Quiz from "../Quiz";
import { Button } from "../ui/button";
import Repetition from "../Repetition";
import { cn } from "@/lib/utils";

export const Sidebar = ({ skillTree }: { skillTree: SkillTree }) => {
  const { tab, courseName, selectedSkill } = useParams();
  const router = useRouter();

  const realSelectedSkill = decodeURIComponent(selectedSkill as string);

  const skillName = skillTree.skills.find(
    (skill) => skill.name === realSelectedSkill,
  )?.displayName;

  return (
    <div>
      {/* TODO: Replace with tabs component */}
      <div className="flex flex-row gap-2">
        <Link href={`/search/${courseName}/${selectedSkill}/knowledge`}>
          <Button
            size="sm"
            variant="ghost"
            className={cn(tab === "knowledge" ? "bg-[#333]" : "bg-none")}
          >
            Knowledge
          </Button>
        </Link>
        <Link href={`/search/${courseName}/${selectedSkill}/quiz`}>
          <Button
            size="sm"
            variant="ghost"
            className={cn(tab === "quiz" ? "bg-[#333]" : "bg-none")}
          >
            Quiz
          </Button>
        </Link>
        <Link href={`/search/${courseName}/${selectedSkill}/repetition`}>
          <Button
            size="sm"
            variant="ghost"
            className={cn(tab === "repetition" ? "bg-[#333]" : "bg-none")}
          >
            Repetition
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 mt-4">{skillName}</h1>

      {tab === "knowledge" && <Knowledge skillTree={skillTree} />}
      {tab === "quiz" && (
        <div className="p-4">
          <Quiz topic={skillName || realSelectedSkill} />
        </div>
      )}
      {tab === "repetition" && (
        <Repetition
          failedAnswers={[
            {
              question:
                "What is the primary function of the mitochondria in a cell?",
              correctAnswer: "To produce energy",
              userAnswer: "To store genetic information",
              rating: 0, // Add this line
            },
            {
              question: "Which planet is known as the Red Planet?",
              correctAnswer: "Mars",
              userAnswer: "Jupiter",
              rating: 0, // Add this line
            },
            {
              question: "Who wrote 'Romeo and Juliet",
              correctAnswer: "William Shakespeare",
              userAnswer: "Charles Dickens",
              rating: 0, // Add this line
            },
          ]}
        />
      )}
      {!tab && <p>Select a tab above to get started.</p>}
    </div>
  );
};
