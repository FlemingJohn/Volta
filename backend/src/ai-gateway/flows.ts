import { z, ai } from './genkit-config';
import { StructuredInputSchema, ValidationResponseSchema } from './schemas';


const gemmaModel = 'ollama/gemma3:1b';


export const extractFieldsFlow = ai.defineFlow(
    {
        name: 'extractFieldsFlow',
        inputSchema: z.string(),
        outputSchema: StructuredInputSchema,
    },
    async (freeText) => {
        const { output } = await ai.generate({
            model: gemmaModel,
            prompt: `Extract cable design parameters from this technical text:

"${freeText}"

Extract and return the following fields. If a field is not mentioned or unknown, OMIT IT from the JSON response entirely. 

Fields to extract:
- standard (string)
- voltage (string)
- conductorMaterial (string)
- conductorClass (string)
- csa (number)
- insulationMaterial (string)
- insulationThickness (number)

IMPORTANT: Return a valid JSON object matching our schema. Do not use placeholders.`,
            output: { schema: StructuredInputSchema },
        });

        if (!output) {
            throw new Error('Failed to extract fields from AI response');
        }

        return output;
    }
);

/**
 * Flow to validate cable design strictly against IEC 60502-1 and IEC 60228 requirements.
 */
export const validateDesignFlow = ai.defineFlow(
    {
        name: 'validateDesignFlow',
        inputSchema: StructuredInputSchema,
        outputSchema: ValidationResponseSchema,
    },
    async (designData) => {
        const fields: string[] = [];
        if (designData.standard) fields.push(`Standard: ${designData.standard}`);
        if (designData.voltage) fields.push(`Voltage: ${designData.voltage}`);
        if (designData.conductorMaterial) fields.push(`Conductor Material: ${designData.conductorMaterial}`);
        if (designData.conductorClass) fields.push(`Conductor Class: ${designData.conductorClass}`);
        if (designData.csa) fields.push(`Cross-Sectional Area: ${designData.csa} mm²`);
        if (designData.insulationMaterial) fields.push(`Insulation Material: ${designData.insulationMaterial}`);
        if (designData.insulationThickness) fields.push(`Insulation Thickness: ${designData.insulationThickness} mm`);

        const { output } = await ai.generate({
            model: gemmaModel,
            system: `You are an expert cable design engineer specializing in IEC 60502-1 and IEC 60228.
Validate the provided design. For each field, provide PASS, WARN, or FAIL status.
ALWAYS be critical. Nominal insulation thickness is a strict requirement.

Return a JSON object with this exact structure:
{
  "fields": { ... },
  "validation": [ { "field": "...", "status": "...", "provided": "...", "expected": "...", "comment": "..." } ],
  "confidence": { "overall": 0.0-1.0 },
  "aiReasoning": "..."
}`,
            prompt: `Validate this cable design strictly against IEC standards:

${fields.join('\n')}

VALIDATION RULES:
1. IEC 60502-1 specifies nominal insulation thickness (e.g., 0.8mm or 1.0mm for 1.5-10 mm²).
2. If a provided value is significantly below nominal, it must be a FAIL.
3. Provide a high-level "aiReasoning" summary of your decision.

IMPORTANT: Do not return a schema definition. Return only the data object.`,
            output: { schema: ValidationResponseSchema },
        });

        if (!output) {
            throw new Error('Failed to generate validation results from AI');
        }

        return output;
    }
);
