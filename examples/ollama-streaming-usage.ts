import { OllamaProvider, OllamaProviderOptionsInput, LLMUsage } from "@elgap/ai-connect";
import { Composer, ChatMessage } from '../src/index.js';

// ===================================================================================
// === Configuration Block - Adjust these values to match your local configuration ===
// ===================================================================================
const model = "gemma3:latest";
const temperature = 0.7;
const baseUrl = 'http://localhost:11434'; //Default for Ollama. Change if it's elsewhere
// ====================================================================================

const providerOptions: OllamaProviderOptionsInput = {
    model: model,
    baseUrl: baseUrl,
    temperature: temperature,
};

// Agent defined persona and behaviour
const agentExpertise = 'You are poem and you write funny songs';

// A message to send to LLM. Be free to change!
const userInput: string = "Write a short, three-verse poem about the dialogue between a human and an AI.";

//Just Initialized, not used in this example
const chatHistory: ChatMessage[] = [];

async function main() {

    console.log(`
  =====================================================
  🚀 @elgap/ai-composer - Basic streaming Usage Example
  =====================================================
  Model in use: ${providerOptions.model}
  Temperature: ${providerOptions.temperature}
  Agent expertize and scope: ${agentExpertise}
  Message sent to LLM: ${userInput}\n
  `);

    try {
        const provider = new OllamaProvider(providerOptions);
        const agent:Composer = Composer.create(provider, agentExpertise);
        console.log(`\n🤖 Agent streaming response:`);

        /**
         * This is basic example to demonstrate response streaming
         *
         * @param userInput:string
         * @param chatHistory:string[]
         * @param tokenUsage:boolean
         */
        const stream = agent.stream(userInput, chatHistory, true);

        for await (const chunk of stream) {

            switch (chunk.type) {
                case 'content':
                    process.stdout.write(chunk.payload as string);
                    break;

                case 'usage':
                    const usage = chunk.payload as LLMUsage;
                    console.log('\n\n--- TOKEN USAGE REPORT ---');
                    console.log(`📊 Token Usage:`, usage);
                    console.log('------------------------------------');
                    break;
            }
        }
        console.log('\n✅ Stream finished, example script completed.');
    } catch (error) {
        console.error("\n❌ An error occurred:", (error as Error).message);
    }
}

main().catch(error => {
    console.error("\n❌ A fatal application error occurred:", error);
    process.exit(1);
});