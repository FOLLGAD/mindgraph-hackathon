import { CohereClient } from "cohere-ai";
import { SkillTree } from "./SkillTree";

const cohere = new CohereClient({
  token: "g0JVEcm1i9zLKv4gRoWVIFntNZNadtkdUAryc9uz", // This is your trial API key
});

const getKnowledge = async (skillTree: SkillTree, skillName: string) => {
  const stream = await cohere.chatStream({
    model: "command-r-plus-08-2024",
    message: "what is Inertial Confinement in the field of nuclear fusion",
    preamble:
      "You are an education assistant who helps students learn about a topic. You write not too long and not too short.",
    temperature: 0.3,
    chatHistory: [
      {
        role: "USER",
        message: `what is ${skillName} in the field of ${skillTree.name}`,
      },
    ],
    promptTruncation: "AUTO",
    connectors: [{ id: "web-search" }],
  });

  for await (const chat of stream) {
    if (chat.eventType === "text-generation") {
      process.stdout.write(chat.text);
    }
    if (chat.eventType === "citation-generation") {
      console.log(chat);
    }
  }
};
