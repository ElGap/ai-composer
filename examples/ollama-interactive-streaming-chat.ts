import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { OllamaProvider, OllamaProviderOptionsInput, LLMUsage } from '@elgap/ai-connect';
import { Composer, ChatMessage, DEFAULT_SYSTEM_PROMPT } from '../src/index.js';

/**
 * ----------- CONFIGURATION BLOCK ------------
 * Adjust to match your local model and
 * adjust temperature or baseUrl if needed
 */
const model = "llama3.1:latest"; //Adjust to mach your locally running model
const baseUrl = 'http://localhost:11434'; //Default for Ollama. Change if it's elsewhere
const temperature = 0.1;

/**
 * Define the Agent perspective or expertise. Be short and concise
*/
const agentExpertise = 'You are type script senior architect and you provide detailed explanations of typescript with code examples and comments.'

const providerOptions: OllamaProviderOptionsInput = {
    model: model,
    baseUrl: baseUrl,
    temperature: temperature,
};
/**
 * Initialize chat history (as empty)
 */
const chatHistory: ChatMessage[] = [];

async function main() {
    console.log(`
  ==================================================
  🚀 @elgap/ai-composer - Interactive STREAMING Chat
  ==================================================
  Model in use: ${providerOptions.model}
  Temperature: ${providerOptions.temperature}\n
  -------------------------------------------------
  System prompt in use:
  ------------------------------------------------- 
  ${DEFAULT_SYSTEM_PROMPT}
  -------------------------------------------------
  AGENT EXPERTISE:
  -------------------------------------------------
  ${agentExpertise}\n
  -------------------------------------------------
  (Type 'exit' to quit)
  `);

    const rl = readline.createInterface({ input, output });

    try {
        const baseProvider = new OllamaProvider(providerOptions);
        const agent:Composer = Composer.create(baseProvider, agentExpertise);

        console.log("✅ Agent is ready. Begin.\n");

        let fullResponse = '';
        while (true) {
            const userInput = await rl.question('You: ');
            if (userInput.toLowerCase() === 'exit') {
                break;
            }
            console.log(`🤖 Agent streaming response:`);
            const stream = agent.stream(userInput, chatHistory, true);

            for await (const chunk of stream) {
                if (chunk.type === 'content') {
                    const content = chunk.payload as string;
                    process.stdout.write(content);
                    fullResponse += content;
                } else if (chunk.type === 'usage') {
                    const usage = chunk.payload as LLMUsage;
                    console.log("\n\n[INFO] Token usage:", usage);
                }
            }

            chatHistory.push({ role: 'User', content: userInput });
            chatHistory.push({ role: 'Assistant', content: fullResponse });

            if (chatHistory.length > 6) {
                chatHistory.splice(0, 2);
            }
        }
    } catch (error) {
        console.error("\n❌ An error occurred:", (error as Error).message);
    } finally {
        rl.close();
    }
}
main().catch(console.error);