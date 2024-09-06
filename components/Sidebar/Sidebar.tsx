import { useState } from "react";
import { Knowledge } from "./Knowledge";

export const Sidebar = ({ selectedSkill }: { selectedSkill: string }) => {
  const [currentTab, setCurrentTab] = useState<string>("knowledge");

  return (
    <div>
      {/* TODO: Replace with tabs component */}
      <div className="flex flex-row gap-2">
        <div>Knowledge</div>
        <div>Quiz</div>
      </div>

      <h1>{selectedSkill}</h1>

      {currentTab === "knowledge" && <Knowledge />}
      {currentTab === "quiz" && <div>Quiz</div>}
    </div>
  );
};
