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
  "insulationThickness": number,
  "maxResistance": string
}

Note: If the input text is completely irrelevant to cable engineering or nonsensical, set "isInvalidInput" to true.
Understand technical abbreviations (e.g., "sqmm", "mm2", "Cu") and map them to their standard engineering meanings.
Fields should use technical abbreviations where appropriate.`;

    const userPrompt = `Extract parameters from: "${freeText}"`;

    try {
        return await callOllama(systemPrompt, userPrompt, StructuredInputSchema, 120000);
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
Use the provided standards context ONLY to validate cable designs.
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

CRITICAL: Your "aiReasoning" MUST be structured with two markdown headers:
1. "### Technical Justification": Explicitly cite the specific IEC standard and threshold values from the provided context (e.g., "Per IEC 60502-1 Table 15..."). Compare provided values exactly against threshold limits.
2. "### Recommendations": Provide specific engineering advice based on the results (e.g., "Increase insulation by 0.2mm to ensure safety margin").

Note: If a critical field (like Standard or Voltage) is missing from the input, issue a WARN in the validation array and explain the assumption in Reasoning.
Note: If the input design data is completely nonsensical or not a cable design, set "isInvalidInput" to true.
CRITICAL: The "confidence" field MUST be an object with an "overall" property.`;

    const userPrompt = `STANDARDS CONTEXT:\n${standardsContext}\n\nPENDING DESIGN:\n${designFields}`;

    try {
        return await callOllama(systemPrompt, userPrompt, ValidationResponseSchema, 120000);
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
2. Validate them against IEC 60502-1 and IEC 60228 strictly using the provided context.
Return strictly valid JSON ONLY. 

JSON Structure:
{
  "isInvalidInput": boolean,
  "fields": { "standard": string, "voltage": string, "maxResistance": string, ... },
  "validation": [
    { "field": string, "status": "PASS" | "WARN" | "FAIL", "provided": any, "expected": any, "comment": string }
  ],
  "confidence": { "overall": number (0-1) },
  "aiReasoning": string
}

CRITICAL: Your "aiReasoning" MUST be structured with two markdown headers:
1. "### Technical Justification": Cite the specific table or clause from the IEC standards context used for validation.
2. "### Recommendations": Provide specific engineering advice or next steps for the designer.

Note: If the description is completely irrelevant to cable engineering or nonsensical, set "isInvalidInput" to true.
CRITICAL: The "confidence" field MUST be an object with an "overall" property.`;

    const userPrompt = `STANDARDS CONTEXT:\n${standardsContext}\n\nDESCRIPTION: "${freeText}"`;

    try {
        return await callOllama(systemPrompt, userPrompt, ValidationResponseSchema, 120000);
    } catch (error: any) {
        console.error(`Ollama Internal Error: ${error.message}`);

        if (getUseFallback()) {
            console.warn(`Falling back to Gemini...`);
            return await callGemini(systemPrompt, userPrompt, ValidationResponseSchema);
        }

        throw new Error(`Ollama failed and Gemini fallback is disabled: ${error.message}`);
    }
}
