import { SkillTree } from "@/components/SkillTree";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export const Knowledge = ({ skillTree }: { skillTree: SkillTree }) => {
  const { courseName, selectedSkill } = useParams();
  const realSelectedSkill = decodeURIComponent(selectedSkill as string);

  const skillName = skillTree.skills.find(
    (skill) => skill.name === realSelectedSkill,
  )?.displayName;

  const [knowledge, setKnowledge] = useState<string>("");

  useEffect(() => {
    if (!skillName) {
      return;
    }
    const abortController = new AbortController();
    fetch(`/api/knowledge`, {
      signal: abortController.signal,
      method: "POST",
      body: JSON.stringify({
        skillName,
        skillTree,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      const reader = response.body?.getReader();
      if (!reader) {
        return;
      }

      const decoder = new TextDecoder();
      // read() returns a promise that resolves when a value has been received
      reader.read().then(function pump({ done, value }): any {
        if (done) {
          // Do something with last chunk of data then exit reader
          return;
        }
        // Otherwise do something here to process current chunk
        const text = decoder.decode(value);

        setKnowledge((v) => v + text);

        // Read some more, and call this function again
        return reader.read().then(pump);
      });
    });

    return () => {
      abortController.abort("effect dismounted");
    };
  }, []);

  if (!knowledge) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Markdown>{knowledge}</Markdown>
    </div>
  );
};
