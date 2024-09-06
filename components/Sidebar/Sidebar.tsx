import { Knowledge } from "./Knowledge";
import { useParams } from "next/navigation";
import { SkillTree } from "../SkillTree";
import Quiz from "../Quiz";
import { Button } from "../ui/button";

export const Sidebar = ({
  selectedSkill,
  skillTree,
}: {
  selectedSkill: string;
  skillTree: SkillTree;
}) => {
  const { tab } = useParams();

  return (
    <div>
      {/* TODO: Replace with tabs component */}
      <div className="flex flex-row gap-2">
        <Button
          size='sm'
          variant='ghost'
          className='text-white bg-[#6D6D6D]'
        >
          Knowledge
        </Button>
        <Button
          size='sm'
          variant='ghost'
          className='text-[#888888] bg-[#333333]'
        >
          Quiz
        </Button>
        <Button
          size='sm'
          variant='ghost'
          className='text-[#888888] bg-[#333333]'
        >
          Repetition
        </Button>

      </div>

      <h1 className="text-2xl font-bold mb-6 mt-4">{selectedSkill}</h1>

      {tab === "knowledge" && (
        <Knowledge
          skillTree={skillTree}
          selectedSkill={selectedSkill}
          key={selectedSkill}
        />
      )}
      {tab === "quiz" && <div className="p-4"><Quiz topic={selectedSkill} /></div>}
    </div>
  );
};
