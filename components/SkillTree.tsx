export interface Skill {
  name: string;
  displayName: string;
  requires: string[];
}
export interface SkillTree {
  skills: Skill[];
  name: string;
}
export const extractSkillTree = (xmlDoc: Document): SkillTree => {
  const skillTreeElement = xmlDoc.getElementsByTagName("skillTree")[0];
  const skillElements = skillTreeElement.getElementsByTagName("skill");

  const skillTree: SkillTree = {
    skills: Array.from(skillElements).map((skillElement) => {
      const name = skillElement.getAttribute("name") || "";
      const displayName = skillElement.getAttribute("displayName") || name;
      const requires = Array.from(
        skillElement.getElementsByTagName("requires"),
      ).map((req) => req.getAttribute("skill") || "");
      return { name, displayName, requires };
    }),
    name: skillTreeElement.getAttribute("name") || "",
  };

  return skillTree;
};
