import React, { createContext, useState, useContext } from "react";
import { SkillTree, Skill } from "@/components/SkillTree";

interface SkillTreeContextType {
  updateSkill: (id: string, score: number) => void;
  setSkillTree: (name: string, skillTree: SkillTree) => void;
  scores: Record<string, number>;
}

const SkillTreeContext = createContext<SkillTreeContextType | undefined>(
  undefined,
);
export const SkillTreeProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [skillTree, setSkillTree] = useState<SkillTree>();
  const [scores, setScores] = useState<Record<string, number>>({});

  const updateSkill = (id: string, score: number) => {
    if (!skillTree) {
      return;
    }
    const skillName = id;
    localStorage.setItem(`${skillTree.name}_${skillName}`, score.toString());
    setScores((prevScores) => ({ ...prevScores, [id]: score }));
  };

  const setSkillTreeFromStorage = (name: string, tree: SkillTree) => {
    setSkillTree(tree);
    const newScores: Record<string, number> = {};
    tree.skills.forEach((skill) => {
      const lname = `${name}_${skill.name}`;
      const storedScore = localStorage.getItem(lname.toLowerCase());
      if (storedScore !== null) {
        newScores[skill.name.toLowerCase()] = parseInt(storedScore, 10);
      }
    });
    setScores(newScores);
  };

  return (
    <SkillTreeContext.Provider
      value={{
        updateSkill,
        setSkillTree: setSkillTreeFromStorage,
        scores,
      }}
    >
      {children}
    </SkillTreeContext.Provider>
  );
};

export const useSkillContext = () => {
  const context = useContext(SkillTreeContext);
  if (context === undefined) {
    throw new Error("useSkillTree must be used within a SkillTreeProvider");
  }
  return context;
};
