import * as readline from 'node:readline/promises';

import { OllamaProvider, OllamaProviderOptionsInput } from '@elgap/ai-connect';
import { Composer, ChatMessage } from '../src/index.js';

// --- Required ---
const model: string = 'llama3.1:latest'; //Set model to match your locally running model
const baseUrl: string = 'http://localhost:11434'; //Default for Ollama, adjust if it's elsewhere

// --- Primary Optional ---
const temperature: number = 0.7; // 0.1 for precision, 1.0 for creativity

// --- Advanced Optional (change 'undefined' to a value to test) ---
const topP: number | undefined = undefined;         // e.g., 0.9
const topK: number | undefined = undefined;         // e.g., 50
const stop: string[] | undefined = undefined;       // e.g., ["\n", "User:"]
const numCtx: number | undefined = undefined;       // e.g., 4096

//Initialize Chat History
const chatHistory: ChatMessage[] = [];

async function main() {
    console.log(`
  ============================================================================
  🚀 @elgap/ai-composer - Basic interactive chat with support for chat history
  ============================================================================
  Model in use: ${model}
  Temperature: ${temperature}
  (Type 'exit' to quit)
  `);

    const rl = readline.createInterface({ input: process.stdin, output:process.stdout });

    const agentExpertise = await rl.question(
        `Enter a Agent expertize and scope:
(e.g., "You are a witty musician who speaks only in songs, insightful songs.")
> `);
    if (!agentExpertise) {
        console.error("Agent expertize is required.");
        rl.close();
        return;
    }

    console.log("\n✅ Initializing Composer with your Agent expertize:\n" +
        `${agentExpertise}`);
    const options: OllamaProviderOptionsInput = {
        model,
        baseUrl,
        temperature,
        // topP,
        // topK,
        // stop,
        // numCtx
    };

    const provider = new OllamaProvider(options);
    const agent = Composer.create(provider, agentExpertise);
    console.log("✅ Agent is ready. Begin the conversation.\n");

    while (true) {
        let userInput = await rl.question('You: ');

        if (userInput.toLowerCase() === 'exit') {
            break;
        }
        console.log(`🤖 Agent is composing...`);
        const response = await agent.compose(userInput, chatHistory);
        console.log('--- MODEL RESPONSE ---');
        console.log(`${response.content}\n`);
        console.log('----------------------\n');

        chatHistory.push({ role: 'User', content: userInput });
        chatHistory.push({ role: 'Assistant', content: response.content });

        if (chatHistory.length > 6) {
            chatHistory.splice(0, 2);
        }
        const promptTokens = response.usage.promptTokens || 0;
        const completionTokens = response.usage.completionTokens || 0;
        const totalTokens = response.usage.totalTokens || 0;
        console.log(`📊 Token Usage: Prompt = ${promptTokens}, Completion = ${completionTokens}, Total: ${totalTokens}\n`);
        console.log('----------------------\n');
    }
    rl.close();
}
main().catch(error => {
    console.error("\n❌ A fatal error occurred:", error);
    process.exit(1);
});