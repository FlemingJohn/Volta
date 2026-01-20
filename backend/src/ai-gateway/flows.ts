import * as fs from 'fs';
import * as path from 'path';
import { z, ai } from './genkit-config';
import { StructuredInputSchema, ValidationResponseSchema } from './schemas';

const OLLAMA_MODEL = `ollama/${process.env.OLLAMA_MODEL || 'gemma3:1b'}`;
const GEMINI_MODEL = `googleai/${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`;
const USE_FALLBACK = process.env.USE_GEMINI_FALLBACK === 'true';

export const extractFieldsFlow = ai.defineFlow(
    {
        name: 'extractFieldsFlow',
        inputSchema: z.string(),
        outputSchema: StructuredInputSchema,
    },
    async (freeText) => {
        const { output } = await ai.generate({
            model: OLLAMA_MODEL,
            system: `You are a Cable Engineering Data Extractor. Parse technical descriptions into structured JSON. Do not guess or hallucinate values.`,
            prompt: `Extract cable design parameters from: "${freeText}"

Fields: standard, voltage, conductorMaterial, conductorClass, csa, insulationMaterial, insulationThickness

Rules:
1. Only extract explicitly mentioned values (95% certainty)
2. Numeric fields: numbers only, no units
3. Return pure JSON object`,
            config: {
                temperature: 0.0,
                maxOutputTokens: 500,
            },
            output: { schema: StructuredInputSchema },
        });

        if (!output) {
            throw new Error('Failed to extract fields from AI response');
        }

        return output;
    }
);


export const validateDesignFlow = ai.defineFlow(
    {
        name: 'validateDesignFlow',
        inputSchema: StructuredInputSchema,
        outputSchema: ValidationResponseSchema,
    },
    async (designData) => {
        const pathsToTry = [
            path.join(process.cwd(), '..', 'standards'),
            path.join(process.cwd(), 'standards'),
            path.join(__dirname, '..', '..', '..', 'standards')
        ];

        let standardsDir = '';
        for (const p of pathsToTry) {
            if (fs.existsSync(p)) {
                standardsDir = p;
                break;
            }
        }

        let standardsContext = '';
        try {
            if (fs.existsSync(standardsDir)) {
                const files = fs.readdirSync(standardsDir);
                for (const file of files) {
                    if (file.endsWith('.md')) {
                        const content = fs.readFileSync(path.join(standardsDir, file), 'utf-8');
                        standardsContext += `\n--- ${file} ---\n${content}\n`;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to read standards:', error);
        }

        const fields: string[] = [];
        if (designData.standard) fields.push(`Standard: ${designData.standard}`);
        if (designData.voltage) fields.push(`Voltage: ${designData.voltage}`);
        if (designData.conductorMaterial) fields.push(`Conductor Material: ${designData.conductorMaterial}`);
        if (designData.conductorClass) fields.push(`Conductor Class: ${designData.conductorClass}`);
        if (designData.csa) fields.push(`CSA: ${designData.csa} mm²`);
        if (designData.insulationMaterial) fields.push(`Insulation Material: ${designData.insulationMaterial}`);
        if (designData.insulationThickness) fields.push(`Insulation Thickness: ${designData.insulationThickness} mm`);

        const systemPrompt = `You are a Cable Design Validator for IEC 60502-1 and IEC 60228.
Use the provided standards context to validate cable designs.
CRITICAL: Return actual validation data as JSON, NOT schema definitions.
CRITICAL: Use ONLY the actual input values provided, do NOT use example values.`;

        const userPrompt = `STANDARDS CONTEXT:
${standardsContext}

CABLE DESIGN TO VALIDATE:
${fields.join('\n')}

Instructions:
1. Validate these 7 fields: standard, voltage, conductorMaterial, conductorClass, csa, insulationMaterial, insulationThickness
2. For each field, determine status using the standards context above:
   - PASS: Complies with IEC standards
   - WARN: Missing or not specified
   - FAIL: Violates IEC standards (cite specific table/clause)
3. Calculate confidence:
   - 0.85-1.0 if all fields PASS
   - 0.5-0.84 if some WARN but no FAIL
   - 0.2-0.49 if any FAIL

Return JSON format:
{
  "fields": {copy all input fields here},
  "validation": [
    {
      "field": "fieldName",
      "status": "PASS or WARN or FAIL",
      "provided": actualValue,
      "expected": expectedValue,
      "comment": "explanation with IEC table reference from standards context"
    }
  ],
  "confidence": {"overall": numberBetween0And1},
  "aiReasoning": "Detailed explanation including: (1) Overall compliance status, (2) Critical issues found with specific IEC table/clause references from standards context, (3) Safety implications if any, (4) Recommendations to fix non-compliant fields"
}

IMPORTANT: Use the ACTUAL values from the cable design above and cite specific tables/clauses from the standards context provided.`;

        const config = {
            temperature: 0.0,
            maxOutputTokens: 600,
        };

        try {
            const { output } = await ai.generate({
                model: OLLAMA_MODEL,
                system: systemPrompt,
                prompt: userPrompt,
                config,
                output: { schema: ValidationResponseSchema },
            });

            if (output) {
                return output;
            }
        } catch (ollamaError) {
            const isMemoryError = ollamaError.message?.includes('memory layout') ||
                ollamaError.message?.includes('out of memory');

            if (isMemoryError && USE_FALLBACK) {
                try {
                    const { output } = await ai.generate({
                        model: GEMINI_MODEL,
                        system: systemPrompt,
                        prompt: userPrompt,
                        config,
                        output: { schema: ValidationResponseSchema },
                    });

                    if (output) {
                        return output;
                    }
                } catch (geminiError) {
                    throw new Error(
                        `Both Ollama and Gemini API failed. Ollama: ${ollamaError.message}. Gemini: ${geminiError.message}`
                    );
                }
            }

            throw ollamaError;
        }

        throw new Error('Failed to generate validation results');
    }
);
