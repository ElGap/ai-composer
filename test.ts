import { Composer } from './src/index';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const myPrompt = `You are a helpful assistant.`;
        const modelName = process.env.TEST_MODEL || 'llama3:8b-instruct';

        const agent = await Composer.create({ model: modelName }, myPrompt);

        const userInput = `Write some haiku for web developers`;
        const response = await agent.compose(userInput);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
test();