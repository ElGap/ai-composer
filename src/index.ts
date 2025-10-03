import { LLMProvider, BaseProviderOptions, LLMResponse, StreamChunk } from '@elgap/ai-connect';

import { DEFAULT_SYSTEM_PROMPT } from './constants/prompts.js';
import type { ChatMessage, ComposerOptions } from './interfaces.js';

class Composer {
    private provider: LLMProvider<BaseProviderOptions>;
    private readonly finalSystemPrompt: string;

    /**
     *
     * @param provider LLMProvider
     * @param agentExpertise string
     * @private
     */
    private constructor(provider: LLMProvider<BaseProviderOptions>, agentExpertise: string) {
        this.provider = provider;
        this.finalSystemPrompt = `
${DEFAULT_SYSTEM_PROMPT}\n 
--- AGENT EXPERTISE ---
${agentExpertise}
--- AGENT EXPERTISE ---`;
    } //end of constructor()

    /**
     *
     * @param provider LLMProvider
     * @param agentExpertise string
     */
    public static create(provider: LLMProvider<BaseProviderOptions>, agentExpertise: string): Composer {
        if (!agentExpertise || agentExpertise.trim() === '') {
            throw new Error('Agent expertise cannot be empty.');
        }
        return new Composer(provider, agentExpertise);
    } //end of create

    /**
     *
     * @param userInput
     * @param chatHistory
     * @return LLMResponse
     */
    public async compose(
        userInput: string,
        chatHistory : ChatMessage[] = []
    ): Promise<LLMResponse> {
        const history = chatHistory
            .map(msg => `${msg.role === 'User' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');
        const finalSystemPrompt: string = `${this.finalSystemPrompt}\n\n--- CHAT HISTORY ---\n${history}\n--- END OF CHAT HISTORY ---`;
        //console.log("Total words: ", finalSystemPrompt.split(/\s+/).length);
        return await this.provider.invoke(userInput, finalSystemPrompt);
    } //end of compose()

    /**
     *
     * @param userInput string
     * @param chatHistory string[]
     * @param tokenUsage boolean
     */
    public async *stream (
        userInput: string,
        chatHistory: ChatMessage[] = [],
        tokenUsage: boolean = false
    ): AsyncIterable<StreamChunk> {

        const history = chatHistory
            .map(msg => `${msg.role === 'User' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');

        const finalSystemPrompt: string = `${this.finalSystemPrompt}\n\n--- CHAT HISTORY ---\n${history}\n--- END OF CHAT HISTORY ---`;
        const userPrompt:string = `--- USER INPUT ---\n${userInput}\n--- END OF USER INPUT ---`;
        //console.log("Total words: ", finalSystemPrompt.split(/\s+/).length);
        yield * this.provider.stream(userPrompt, finalSystemPrompt, tokenUsage);
    } //end of stream()
}

export { Composer, DEFAULT_SYSTEM_PROMPT };
export type { ComposerOptions, LLMResponse, ChatMessage };