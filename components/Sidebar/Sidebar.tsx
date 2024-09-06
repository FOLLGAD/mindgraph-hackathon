import { Knowledge } from "./Knowledge";
import { useParams, useRouter } from "next/navigation";
import { SkillTree } from "../SkillTree";
import Link from "next/link";
import Quiz from "../Quiz";

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
          <div className="p-4 py-2 rounded bg-gray-500">Knowledge</div>
        </Link>
        <Link href={`/search/${courseName}/${selectedSkill}/quiz`}>
          <div className="p-4 py-2 rounded bg-gray-500">Quiz</div>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 mt-4">{skillName}</h1>

      {tab === "knowledge" && <Knowledge skillTree={skillTree} />}
      {tab === "quiz" && <div className="p-4"><Quiz topic={realSelectedSkill} /></div>}
      {!tab && <p>Select a tab to view the content.</p>}
    </div>
  );
};
