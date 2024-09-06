"use client";
import { redirect } from "next/navigation";
import { SkillTreeFlow } from "@/components/flow";
import { useEffect, useMemo, useState } from "react";
import { extractSkillTree, SkillTree } from "@/components/SkillTree";
import { fusionSkillTree } from "@/components/data";
import { useParams } from "next/navigation";

const parseXML = (xmlString: string): Document => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
};

const getSkillTree = (skillName: string): SkillTree => {
  return extractSkillTree(parseXML(fusionSkillTree));
};

export default function CoursePage() {
  const { courseName: _courseName } = useParams();

  const courseName = useMemo(
    () => decodeURIComponent(_courseName as string),
    [_courseName],
  );

  const skillTree = useMemo(() => getSkillTree(courseName), [courseName]);

  const [selectedSkill, setSelectedSkill] = useState<string>();

  const skillTreeViz = useMemo(
    () =>
      skillTree && (
        <SkillTreeFlow
          key="flow"
          skillTree={skillTree}
          onSkillSelected={(skill) => setSelectedSkill(skill)}
        />
      ),
    [skillTree],
  );

  if (Array.isArray(courseName) || !courseName) {
    return redirect("/");
  }

  if (!skillTree) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mt-10 ml-4 text-4xl text-white">{courseName}</div>
      <div className="flex flex-row">
        <div className="w-1/2">{skillTreeViz}</div>
        <div className="w-1/2">{selectedSkill}</div>
      </div>
    </div>
  );
}
