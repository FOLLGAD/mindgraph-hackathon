import { SkillTree } from "@/components/SkillTree";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: "g0JVEcm1i9zLKv4gRoWVIFntNZNadtkdUAryc9uz", // This is your trial API key
});

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
const encoder = new TextEncoder();

export async function POST(req: Request) {
  const { skillName, skillTree } = await req.json();

  const response = await cohere.chatStream({
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

  const stream = iteratorToStream(response);

  return stream;
}
