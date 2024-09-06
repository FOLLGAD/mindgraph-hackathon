import { useState } from "react";
import { Knowledge } from "./Knowledge";

export const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState<string>("knowledge");
  return (
    <div>
      {/* TODO: Replace with tabs component */}
      <div className="flex flex-col">
        <div>Knowledge</div>
        <div>Quiz</div>
      </div>

      {currentTab === "knowledge" && <Knowledge />}
      {currentTab === "quiz" && <div>Quiz</div>}
    </div>
  );
};
