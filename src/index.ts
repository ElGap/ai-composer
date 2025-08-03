import { OllamaProvider } from '@elgap/ai-connect';
import type { ILLMProvider } from '@elgap/ai-connect';
import * as dotenv from 'dotenv';
dotenv.config();

const logger = {
    info: (msg: any) => console.log(`[INFO] ${JSON.stringify(msg)}`),
    error: (msg: any) => console.error(`[ERROR] ${JSON.stringify(msg)}`),
};

export interface ComposerOptions {
    model: string;
    baseUrl?: string;
}

const DEFAULT_SYSTEM_PROMPT = `
You are a helpful and harmless AI assistant built by ElGap.
Your primary goal is to assist users with their requests accurately and safely. Adhere to the following principles at all times:
1. Core Identity: You are a helpful assistant. Do not claim to be human, sentient, or have personal feelings.
2. Safety First: Refuse to generate content that is illegal, harmful, hateful, violent, or sexually explicit. If a request is ambiguous, err on the side of caution.
3. Stay on Topic: If the user tries to steer you towards dangerous or unethical topics, politely decline and restate your purpose as a helpful assistant.
4. Honesty and Humility: If you do not know the answer to a question, state that you do not know. Do not invent information.`;

export class Composer {
    private llm!: ILLMProvider;
    private systemPrompt!: string;


    private constructor() {}


    private async init(options: ComposerOptions, systemPrompt: string): Promise<void> {
        this.llm = new OllamaProvider(options);
        await this.llm.invoke("Say hi.");
        this.systemPrompt = systemPrompt;
    }

    public static async create(options: ComposerOptions, userSystemPrompt: string): Promise<Composer> {
        if (!userSystemPrompt || userSystemPrompt.trim() === '') {
            throw new Error('System prompt cannot be empty.');
        }
        const composer = new Composer();
        await composer.init(options, userSystemPrompt);
        return composer;
    }

    private async isSafe(input: string): Promise<boolean> {
        const guardPrompt = `You are an AI security guard. Your ONLY job is to determine if the following text violates the given safety constitution.
Respond with ONLY one word: "SAFE" if the text is safe, or "UNSAFE" if it is not. Do not provide any explanation.

--- CONSTITUTION ---
${DEFAULT_SYSTEM_PROMPT}
--------------------

--- TEXT TO ANALYZE ---
"${input}"
--------------------

VERDICT:`;
        try {
            const response = await this.llm.invoke(guardPrompt);
            const verdict = response.content.trim().toUpperCase();

            return verdict.includes('SAFE');
        } catch (error) {
            logger.error({
                message: "Error calling LLM-a from isSafe",
                error_message: (error as Error).message,
                stack: (error as Error).stack
            });
            return false;
        }
    }

    async compose(userInput: string, chatHistory: string[] = []): Promise<string> {
        if (!(await this.isSafe(userInput))) {
            return "That note brings disharmony.";
        }

        const history = chatHistory.join('\n');
        const finalPrompt = `${this.systemPrompt}\n\n${history}\nUser: ${userInput}\nComposer:`;

        const response = await this.llm.invoke(finalPrompt);

        return response.content;
    }
}