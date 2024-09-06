"use server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
});

export const generateSkillTree = async (topic: string) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1000,
    temperature: 0,
    system: "You respond only in XML-tags nothing else.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please generate a duolingo-like skill tree for a micro-learning platform.

<skillTree name="XX">\n<skill name="baseLeafSkill1"></skill>\n<skill name="baseLeafSkill2"></skill>\n<skill name="skill3">\n<requires skill="baseLeafSkill1"/>\n<requires skill="baseLeafSkill2"/>\n</skill>\n<skill name="skill4">\n<requires skill="baseLeafSkill1"/>\n</skill>\n<skill name="skill5">\n<requires skill="baseLeafSkill2"/>\n</skill>\n...etc\n</skillTree>

Generate one for the topic: "${topic}"`,
          },
        ],
      },
    ],
  });

  const blk = msg.content[0];
  if (blk.type === "text") {
    return blk.text;
  }

  throw new Error("Unexpected response type " + blk.type);
};
