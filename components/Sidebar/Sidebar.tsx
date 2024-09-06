import { useState } from "react";
import { Knowledge } from "./Knowledge";
import { useParams } from "next/navigation";

export const Sidebar = ({ selectedSkill }: { selectedSkill: string }) => {
  const { tab } = useParams();

  return (
    <div>
      {/* TODO: Replace with tabs component */}
      <div className="flex flex-row gap-2">
        <div className="p-4 py-2   rounded bg-gray-500">Knowledge</div>
        <div className="p-4 py-2   rounded bg-gray-500">Quiz</div>
      </div>

      <h1 className="text-2xl font-bold mb-6 mt-4">{selectedSkill}</h1>

      {tab === "knowledge" && <Knowledge />}
      {tab === "quiz" && <div className="p-4">Quiz component here</div>}
    </div>
  );
};
