import { getKnowledge2 } from "@/app/utils";
import { SkillTree } from "@/components/SkillTree";
import { useEffect, useState } from "react";

export const Knowledge = ({
  skillTree,
  selectedSkill,
}: {
  skillTree: SkillTree;
  selectedSkill: string;
}) => {
  const [knowledge, setKnowledge] = useState<string>("");

  useEffect(async () => {
    const gen = await getKnowledge2(skillTree, selectedSkill);
    for await (const part of gen) {
      setKnowledge((p) => p + part);
    }
    return () => {};
  }, []);

  return <div>{knowledge}</div>;
};
