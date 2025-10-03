import { BaseProviderOptions, LLMResponse } from '@elgap/ai-connect';

export interface ComposerOptions extends BaseProviderOptions {}

export interface ChatMessage {
    role: 'User' | 'Assistant';
    content: string;
}

export { LLMResponse };