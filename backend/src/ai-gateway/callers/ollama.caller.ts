import axios from 'axios';
import { ZodSchema } from 'zod';
import { OLLAMA_MODEL, OLLAMA_URL } from '../config';
import { extractJson } from '../utils';

export async function callOllama(system: string, prompt: string, schema: ZodSchema, timeoutMs: number) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        console.log(`Calling Ollama (${OLLAMA_MODEL})...`);
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
            model: OLLAMA_MODEL,
            system,
            prompt,
            stream: false,
            format: 'json',
            options: { temperature: 0, num_predict: 1000 }
        }, { signal: controller.signal });

        clearTimeout(timeout);
        const data = extractJson(response.data.response);

        // Validate against schema
        try {
            return schema.parse(data);
        } catch (schemaError: any) {
            console.error('Ollama Schema Validation Failed:', schemaError.errors);
            throw new Error(`Ollama output did not match expected schema: ${schemaError.message}`);
        }
    } catch (error: any) {
        clearTimeout(timeout);
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const msg = error.response?.data?.error || error.message;
            throw new Error(`Ollama Error (${status || 'Network'}): ${msg}`);
        }
        throw error;
    }
}
