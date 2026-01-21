import { ZodSchema } from 'zod';
import { getGeminiModel } from '../config';
import { extractJson, delay, getGenAI } from '../utils';

export async function callGemini(system: string, prompt: string, schema: ZodSchema, retries = 3): Promise<any> {
    const modelName = getGeminiModel();
    console.log(`Calling Gemini (${modelName})...`);

    const genAIClient = getGenAI();
    const model = genAIClient.getGenerativeModel({ model: modelName }, { apiVersion: 'v1beta' });

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `${system}\n\n${prompt}` }] }],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 4096,
                responseMimeType: "application/json"
            }
        });

        const text = result.response.text();
        const data = extractJson(text);

        // Validate against schema
        try {
            return schema.parse(data);
        } catch (schemaError: any) {
            console.error('Gemini Schema Validation Failed:', schemaError.errors);
            throw new Error(`Gemini output did not match expected schema: ${schemaError.message}`);
        }

    } catch (error: any) {
        const isRateLimit = error.message.includes("429") ||
            error.message.includes("QuotaFailure") ||
            error.message.includes("retry in");

        if (isRateLimit && retries > 0) {
            console.warn(`⚠️ Gemini Rate Limit Hit. Waiting 20s... (${retries} attempts left)`);
            await delay(20000);
            return callGemini(system, prompt, schema, retries - 1);
        }

        console.error(`Gemini Fatal Error (${modelName}): ${error.message}`);
        throw new Error(`Gemini Failure: ${error.message}`);
    }
}
