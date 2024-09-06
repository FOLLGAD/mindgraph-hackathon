import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: "g0JVEcm1i9zLKv4gRoWVIFntNZNadtkdUAryc9uz", // This is your trial API key
});

const encoder = new TextEncoder();

export async function POST(req: Request) {
  const { skillName, skillTree, withSources = false } = await req.json();

  const response = await cohere.chatStream({
    model: "command-r-08-2024",
    message: `what is ${skillName} in the field of ${skillTree.name}`,

    preamble:
      "You are an education assistant who helps students learn about a topic. You write not too long and not too short.",
    temperature: 0.3,
    chatHistory: [
      {
        role: "USER",
        message: `what is ${skillName} in the field of ${skillTree.name}`,
      },
    ],
    maxTokens: 1000,
    promptTruncation: "AUTO",
    connectors: withSources ? [{ id: "web-search" }] : undefined,
  });

  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      // Start encoding 'Basic Streaming Test',
      // and add the resulting stream to the queue
      for await (const chunk of response) {
        if (chunk.eventType === "text-generation") {
          controller.enqueue(encoder.encode(chunk.text));
        }
        console.log(chunk);
      }
      controller.close();
    },
  });

  return new Response(customReadable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
