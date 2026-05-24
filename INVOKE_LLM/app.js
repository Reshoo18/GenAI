import Groq from "groq-sdk";
import {tavily } from '@tavily/core'

const tvly=tavily({apiKey:process.env.TAVILY_API_KEY})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  const completions = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,

    messages: [
      {
        role: "system",
        content: `You are a personal assistance who answer the asked question.
            you have access to following tools
            1. webSearch({query} : {query:string}) //Search the latest information and realtime data o the internet`,
      },
      {
        role: "user",
        content: "when i phone 16 launched?",
      },
    ],

    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description:
            "Search the latest information and realtime data o the internet",

          parameters: {
            type: "object",

            properties: {
              query: {
                type: "string",
                description: "The search query to perform serch on",
              },
            },

            required: ["query"],
          },
        },
      },
    ],

    tool_choice: "auto",
  });

  console.log(
    JSON.stringify(
      completions.choices[0].message.content,
      null,
      2
    )
  );

  const toolCalls = completions.choices[0].message.tool_calls;

  if (!toolCalls) {
    console.log(
      `Assistance ${completions.choices[0].message.content}`
    );
    return;
  }

  for (const tool of toolCalls) {
    console.log("tool", tool);

    const functionName = tool.function.name;

    const functionParams = JSON.parse(
      tool.function.arguments
    );

    if (functionName === "webSearch") {
      const toolResult = await webSearch(functionParams);

      console.log("tool result", toolResult);
    }
  }
}

main();

async function webSearch({ query }) {
  console.log("result is comming")
  const response= await tvly.search(query)
  console.log('Response: ', response)
  return "i phone 16 was launched on 20 september 2024";
}