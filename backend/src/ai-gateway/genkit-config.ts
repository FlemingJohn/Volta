import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';

export const ai = genkit({
    plugins: [
        ollama({
            serverAddress: process.env.OLLAMA_API_URL || 'http://localhost:11434',
        }),
    ],
});
