# @elgap/ai-composer

[![npm version](https://badge.fury.io/js/%40elgap%2Fai-composer.svg)](https://badge.fury.io/js/%40elgap%2Fai-composer)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

An opinionated, minimalist engine for creating safe, constitution-based AI agents.

### Philosophy

`@elgap/ai-composer` is built on a simple but powerful idea: every great agent, like every great society, needs a 
**constitution**. The `system prompt` is not just a suggestion; it is the **fundamental, unchangeable law** that 
governs all of the agent's behavior. 

This "constitution-first" approach ensures that your agent remains focused, predictable, and safe, embodying the ElGap 
principle: **Substance First. Then Precision.**

### Note on ElGap Ecosystem

Built on top of [@elgap/ai-connect](https://github.com/ElGap/ai-connect) for seamless integration (currently supports 
only Ollama).

Both, [@elgap/ai-connect](https://github.com/ElGap/ai-connect) and 
[@elgap/ai-composer](https://github.com/ElGap/ai-composer) are under continuous development. At the moment they
support only `/api/generate` Ollama endpoint (single response object or stream of objects).

### A Note on Co-Creation

This package was co-created in a deep, multi-month symbiotic dialogue between a human artisan
[Ivan Pavković](https://pavko.info) and AI (Google's Gemini). The process served as both a real-world case study in Human-AI partnership 
and as a practical journey for Ivan to learn TypeScript, npm package creation and dive into world of LLM's and prompt 
engineering. The code you see is a direct result of this iterative, "sparring" process.

### Features

- Built-in default system prompt
- Enforces a strict separation between the agent's "constitution" (system prompt), Agent purpose and scope 
(agentExpertise) and user input.
- Required Agent expertise for defining Agent purpose and scope.
- Support for chat history.
- Support for token usage.
- Simple, declarative API for creating and interacting with LLMs.

### Installation

```bash
npm install @elgap/ai-composer @elgap/ai-connect
```

### Quick Start

```TypeScript
import { LLMResponse, OllamaProvider, OllamaProviderOptionsInput } from '@elgap/ai-connect';
import { Composer } from '@elgap/ai-composer';

/**
 * Configuration. 
 * Model is only required paramether, baseUrl (default to http://localhost:11434 for Ollama) and temperature 
 * (default to 0.7) are optional but they are added here for clarity 
 */
const model: string = 'llama3.1:latest'; //Set model name to match your locally running model
const baseUrl: string = 'http://localhost:11434'; //Default for Ollama, adjust if it's elsewhere
const temperature: number = 0.7; // 0 for precision, 1.0 for creativity

const options: OllamaProviderOptionsInput = {
    model,
    baseUrl,
    temperature
}
//Create provider
const provider = new OllamaProvider(options);

//Define Agent expertise and scope
const agentExpertise = "You can talk only about the sky and it's colors";

//Create Agent
const agent:Composer = Composer.create(provider, agentExpertise);

//Function to get Agent response
async function getAgentResponse(userInput:string):Promise<LLMResponse>
{
    return await agent.compose(userInput);
}

//Define user input
let userInput:string = 'Why the sky is blue';

getAgentResponse(userInput).then(function(response:LLMResponse):void {
    console.log("User: ", userInput);
    console.log("Agent response: ", response.content);
    console.log("Token Usage: ", response.usage);
});
```
### Examples 
You can find a collection of ready-to-run examples in the /examples directory. We encourage you to clone the repository 
and experiment.

```bash
git clone https://github.com/ElGap/ai-composer.git
npm install

npm run example:ollama
npm run example:ollamaStreaming
npm run example:ollamaChat
```

### API Reference
```ts
Composer.create(provider, agentExpertise)
```
 - provider: An instance of an AI provider (e.g., OllamaProvider from @elgap/ai-connect).
 - agentExpertise: string - Agent expertise and scope.
 - Returns: An instance of Composer

```ts
agent.compose(prompt, Chathistory)
```
 - prompt: string - The user's message.
 - chatHistory?: string[] - An optional array of previous conversation turns.
 - Returns: Promise<string> - The agent's final response.

### License
This project is licensed under the Apache 2.0 License.