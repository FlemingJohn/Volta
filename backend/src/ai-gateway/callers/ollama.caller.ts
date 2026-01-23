import axios from 'axios';
import { ZodSchema } from 'zod';
import { getOllamaModel, getOllamaUrl } from '../config';
import { extractJson } from '../utils';

export async function callOllama(system: string, prompt: string, schema: ZodSchema, timeoutMs: number) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const model = getOllamaModel();
        console.log(`Calling Ollama (${model})...`);
        const response = await axios.post(`${getOllamaUrl()}/api/generate`, {
            model,
            system,
            prompt,
            stream: false,
            format: 'json',
            options: { temperature: 0, num_predict: 1000 }
        }, { signal: controller.signal });

        clearTimeout(timeout);
        const data = extractJson(response.data.response);

        try {
            return schema.parse(data);
        } catch (schemaError: any) {
            console.error('Ollama Schema Validation Failed:', schemaError.errors);
            throw new Error(`Ollama output did not match expected schema: ${schemaError.message}`);
        }
    } catch (error: any) {
        clearTimeout(timeout);

        if (error.name === 'CanceledError' || error.message?.includes('canceled')) {
            throw new Error(`Ollama Error: Request canceled/timed out. This is likely due to local hardware memory (RAM/VRAM) or performance constraints.`);
        }

        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const msg = error.response?.data?.error || error.message;
            throw new Error(`Ollama Error (${status || 'Network'}): ${msg}`);
        }
        throw error;
    }
}
