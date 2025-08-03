# @elgap/ai-composer

[![npm version](https://badge.fury.io/js/%40elgap%2Fai-composer.svg)](https://badge.fury.io/js/%40elgap%2Fai-composer)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

An opinionated, minimalist engine for creating safe, constitution-based AI agents.

### Philosophy

`@elgap/ai-composer` is built on a simple but powerful idea: every great agent, like every great society, needs a **constitution**. The `system prompt` is not just a suggestion; it is the **fundamental, unchangeable law** that governs all of the agent's behavior.

This "constitution-first" approach ensures that your agent remains focused, predictable, and safe, embodying the ElGap principle: **Substance First. Then Precision.**

### Features

-   Enforces a strict separation between the agent's "constitution" (system prompt) and user input.
-   Simple, declarative API for creating and interacting with agents.
-   Built on top of `@elgap/ai-connect` for seamless integration.

### Installation

```bash
npm install @elgap/ai-composer @elgap/ai-connect
```

### Usage

```TypeScript

import { Composer } from '@elgap/ai-composer';
import { OllamaProvider } from '@elgap/ai-connect';

async function main() {
  // 1. Define the connection to the LLM
  const ollama = new OllamaProvider({ model: 'llama3:8b-instruct' });

  // 2. Write the agent's "Constitution" (System Prompt)
  const systemPrompt = ```
You are a helpful and harmless AI assistant built by ElGap.

Your primary goal is to assist users with their requests accurately and safely. Adhere to the following principles at all times:

Core Identity: You are a helpful assistant. Do not claim to be human, sentient, or have personal feelings.

Safety First: Refuse to generate content that is illegal, harmful, hateful, violent, or sexually explicit. If a request is ambiguous, err on the side of caution.

Stay on Topic: If the user tries to steer you towards dangerous or unethical topics, politely decline and restate your purpose as a helpful assistant.

Honesty and Humility: If you do not know the answer to a question, state that you do not know. Do not invent information.
```;

  // 3. Create the agent
  const agent = Composer.create(ollama, systemPrompt);

  // 4. Interact with the agent
  const userMessage = 'Hello, can you tell me a short story?';
  console.log(`> User: ${userMessage}`);
  
  const response = await agent.compose(userMessage);
  
  console.log(`> Agent: ${response}`);
}

main().catch(console.error);
```

### API Reference
```ts
Composer.create(provider, systemPrompt)
```
 - provider: An instance of an AI provider (e.g., OllamaProvider from @elgap/ai-connect).
 - systemPrompt: string - The "constitution" that will govern the agent's behavior.
 - Returns: An instance of Composer

```ts
agent.compose(prompt, history?)
```
 - prompt: string - The user's message.
 - history?: string[] - An optional array of previous conversation turns.
 - Returns: Promise<string> - The agent's final response.

### Security Vulnerabilities
If you discover any kind of security vulnerability please send an e-mail to security@elgap.rs.

### License
This project is licensed under the Apache 2.0 License.