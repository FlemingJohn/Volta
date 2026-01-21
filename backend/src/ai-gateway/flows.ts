import { StructuredInputSchema, ValidationResponseSchema } from './schemas';
import { getUseFallback } from './config';
import { getStandardsContext } from './context';
import { callOllama, callGemini } from './callers';


export async function extractFieldsFlow(freeText: string) {
    const systemPrompt = `You are a Cable Engineering Data Extractor. 
Parse technical descriptions into valid JSON.
Return ONLY valid JSON. No conversational text.

JSON Structure:
{
  "isInvalidInput": boolean,
  "standard": string,
  "voltage": string,
  "conductorMaterial": string,
  "conductorClass": string,
  "csa": number,
  "insulationMaterial": string,
  "insulationThickness": number
}

Note: If the input text is completely irrelevant to cable engineering or nonsensical, set "isInvalidInput" to true.
Fields should use technical abbreviations (e.g., "Cu", "PVC", "XLPE") where appropriate.`;

    const userPrompt = `Extract parameters from: "${freeText}"`;

    try {
        return await callOllama(systemPrompt, userPrompt, StructuredInputSchema, 15000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(systemPrompt, userPrompt, StructuredInputSchema);
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

    const systemPrompt = `You are an expert Cable Design Validator for IEC 60502-1 and IEC 60228.
Use the provided standards context to validate cable designs.
Return strictly valid JSON ONLY. No markdown blocks.

JSON Structure:
{
  "isInvalidInput": boolean,
  "fields": { [key: string]: any },
  "validation": [
    { "field": string, "status": "PASS" | "WARN" | "FAIL", "provided": any, "expected": any, "comment": string }
  ],
  "confidence": { "overall": number (0-1) },
  "aiReasoning": string
}

Note: If the input design data is completely nonsensical or not a cable design, set "isInvalidInput" to true.
CRITICAL: The "confidence" field MUST be an object with an "overall" property.`;

    const userPrompt = `STANDARDS CONTEXT:\n${standardsContext}\n\nPENDING DESIGN:\n${designFields}`;

    try {
        return await callOllama(systemPrompt, userPrompt, ValidationResponseSchema, 15000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(systemPrompt, userPrompt, ValidationResponseSchema);
        }

        throw new Error(`Ollama failed and Gemini fallback is disabled: ${error.message}`);
    }
}


export async function validateFreeTextFlow(freeText: string) {
    const standardsContext = getStandardsContext();

    const systemPrompt = `You are a Cable Engineering Expert.
1. Extract parameters from the description.
2. Validate them against IEC 60502-1 and IEC 60228 using the context.
Return strictly valid JSON ONLY. 

JSON Structure:
{
  "isInvalidInput": boolean,
  "fields": { "standard": string, "voltage": string, ... },
  "validation": [
    { "field": string, "status": "PASS" | "WARN" | "FAIL", "provided": any, "expected": any, "comment": string }
  ],
  "confidence": { "overall": number (0-1) },
  "aiReasoning": string
}

Note: If the description is completely irrelevant to cable engineering or nonsensical, set "isInvalidInput" to true.
CRITICAL: The "confidence" field MUST be an object with an "overall" property.`;

    const userPrompt = `STANDARDS CONTEXT:\n${standardsContext}\n\nDESCRIPTION: "${freeText}"`;

    try {
        return await callOllama(systemPrompt, userPrompt, ValidationResponseSchema, 20000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(systemPrompt, userPrompt, ValidationResponseSchema);
        }

        throw new Error(`Ollama failed and Gemini fallback is disabled: ${error.message}`);
    }
}
