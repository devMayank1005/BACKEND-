import dotenv from "dotenv";
dotenv.config();

import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import * as z from "zod";

import { sendEmail } from "./mail.service.js";

// ✅ Tool Definition
const emailTool = tool(sendEmail, {
    name: "emailTool",
    description: "Use this tool to send an email",
    schema: z.object({
        to: z.string().describe("Recipient email address"),
        subject: z.string().describe("Subject of the email"),
        html: z.string().describe("HTML content of the email"),
    }),
});

// ✅ CLI setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// ✅ DEBUG (remove later)
console.log("Mistral API Key:", process.env.MISTRAL_API_KEY);

// ✅ Mistral Model (FIXED)
const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
});

// ✅ Agent
const agent = createAgent({
    model,
    tools: [emailTool],
});

const messages = [];

while (true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ");

    messages.push(new HumanMessage(userInput));

    try {
        const response = await agent.invoke({ messages });

        const aiMessage = response.messages[response.messages.length - 1];
        messages.push(aiMessage);

        console.log(`\x1b[34m[AI]\x1b[0m ${aiMessage.content}`);
    } catch (err) {
        console.error("\n❌ ERROR:", err.message);
    }
}