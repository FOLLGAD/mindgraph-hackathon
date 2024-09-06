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

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`/api/knowledge`, {
      signal: abortController.signal,
      method: "POST",
      body: JSON.stringify({
        skillName: selectedSkill,
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
      reader.read().then(function pump({ done, value }) {
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
      abortController.abort();
    };
  }, []);

  return <div>{knowledge}</div>;
};
