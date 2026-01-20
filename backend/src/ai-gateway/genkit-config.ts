import { genkit, z } from 'genkit';
export { z };
import { ollama } from 'genkitx-ollama';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
    plugins: [
        ollama({
            serverAddress: process.env.OLLAMA_API_URL || 'http://localhost:11434',
        }),
        googleAI({
            apiKey: process.env.GEMINI_API_KEY,
        }),
    ],
});
