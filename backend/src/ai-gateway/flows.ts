import { StructuredInputSchema, ValidationResponseSchema, MultiCoreValidationResponseSchema } from './schemas';
import { getUseFallback } from './config';
import { getStandardsContext } from './context';
import { callOllama, callGemini } from './callers';
import {
    EXTRACTION_SYSTEM_PROMPT,
    VALIDATION_SYSTEM_PROMPT,
    FREE_TEXT_SYSTEM_PROMPT,
    MULTI_CORE_SYSTEM_PROMPT
} from './prompts';

export async function extractFieldsFlow(freeText: string) {
    const userPrompt = `Extract parameters from: "${freeText}"`;

    try {
        return await callOllama(EXTRACTION_SYSTEM_PROMPT, userPrompt, StructuredInputSchema, 20000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(EXTRACTION_SYSTEM_PROMPT, userPrompt, StructuredInputSchema);
        }

        throw new Error(`Ollama failed and Gemini fallback is disabled: ${error.message}`);
    }
}

export async function validateDesignFlow(designData: any) {
    const standardsContext = getStandardsContext();
    const designFields = Object.entries(designData)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    const userPrompt = `STANDARDS CONTEXT:\n${standardsContext}\n\nPENDING DESIGN:\n${designFields}`;

    try {
        return await callOllama(VALIDATION_SYSTEM_PROMPT, userPrompt, ValidationResponseSchema, 20000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(VALIDATION_SYSTEM_PROMPT, userPrompt, ValidationResponseSchema);
        }

        throw new Error(`Ollama failed and Gemini fallback is disabled: ${error.message}`);
    }
}

export async function validateFreeTextFlow(freeText: string) {
    const standardsContext = getStandardsContext();
    const userPrompt = `STANDARDS CONTEXT:\n${standardsContext}\n\nDESCRIPTION: "${freeText}"`;

    try {
        return await callOllama(FREE_TEXT_SYSTEM_PROMPT, userPrompt, ValidationResponseSchema, 20000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(FREE_TEXT_SYSTEM_PROMPT, userPrompt, ValidationResponseSchema);
        }

        throw new Error(`Ollama failed and Gemini fallback is disabled: ${error.message}`);
    }
}

export async function validateMultiCoreFlow(multiCoreText: string) {
    const standardsContext = getStandardsContext();
    const userPrompt = `STANDARDS CONTEXT:\n${standardsContext}\n\nMULTI-CORE INPUT (semicolon-separated):\n"${multiCoreText}"`;

    try {
        return await callOllama(MULTI_CORE_SYSTEM_PROMPT, userPrompt, MultiCoreValidationResponseSchema, 30000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(MULTI_CORE_SYSTEM_PROMPT, userPrompt, MultiCoreValidationResponseSchema);
        }

        throw new Error(`Ollama failed and Gemini fallback is disabled: ${error.message}`);
    }
}
