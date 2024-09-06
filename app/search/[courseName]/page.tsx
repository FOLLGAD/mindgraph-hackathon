"use client";
import { redirect } from "next/navigation";
import { SkillTreeFlow } from "@/components/flow";
import { useEffect, useMemo, useState } from "react";
import { extractSkillTree, SkillTree } from "@/components/SkillTree";
import { fusionSkillTree } from "@/components/data";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { generateSkillTree } from "@/app/utils";

const parseXML = (xmlString: string): Document => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  return xmlDoc;
};

export default function CoursePage() {
  const { courseName: _courseName, tab } = useParams();

  const courseName = useMemo(
    () => decodeURIComponent(_courseName as string),
    [_courseName],
  );

  const [skillTree, setSkillTree] = useState<SkillTree>();

  useEffect(() => {
    const localstorage = localStorage.getItem(courseName.toLowerCase());
    if (localstorage) {
      setSkillTree(JSON.parse(localstorage));
    }

    generateSkillTree(courseName).then((skillTreeXML) => {
      const st = extractSkillTree(parseXML(skillTreeXML));
      localStorage.setItem(courseName.toLowerCase(), JSON.stringify(st));
      setSkillTree(st);
    });
  }, [courseName]);

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
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <div className="mt-10 ml-4 text-4xl text-white">{courseName}</div>
      <div className="flex flex-1 p-4 space-x-4">
        <div className="w-1/2 bg-[#242424] p-4 rounded-lg overflow-hidden">
          {skillTreeViz}
        </div>
        <div className="w-1/2 flex flex-col space-y-4">
          <div className="flex-1 bg-[#242424] p-4 rounded-lg overflow-y-auto">
            {!!selectedSkill && (
              <Sidebar selectedSkill={selectedSkill} skillTree={skillTree} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
