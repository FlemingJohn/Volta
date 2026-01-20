import * as fs from 'fs';
import * as path from 'path';
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
            system: `You are a precision-focused Cable Engineering Data Extractor.
Your goal is to parse messy technical descriptions into a strict JSON schema for downstream validation.
Maintain absolute data integrity. Do not guess or hallucinate values.`,
            prompt: `Extract cable design parameters from this technical text:

"${freeText}"

Fields to extract:
- standard: Must be the IEC standard number (e.g., 60502-1).
- voltage: Rated voltage (e.g., 0.6/1 kV).
- conductorMaterial: Cu, Al, etc.
- conductorClass: Class 1, 2, 5, or 6.
- csa: Cross-sectional area in mm² (Numeric only).
- insulationMaterial: PVC, XLPE, etc.
- insulationThickness: Nominal thickness in mm (Numeric only).

CRITICAL RULES:
1. If a field is NOT explicitly mentioned or cannot be inferred with 95% certainty, OMIT it.
2. For numeric fields (csa, insulationThickness), provide only the number. No units in the value.
3. Return ONLY a pure JSON object. No preamble.`,
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
        const fields: string[] = [];
        if (designData.standard) fields.push(`Standard: ${designData.standard}`);
        if (designData.voltage) fields.push(`Voltage: ${designData.voltage}`);
        if (designData.conductorMaterial) fields.push(`Conductor Material: ${designData.conductorMaterial}`);
        if (designData.conductorClass) fields.push(`Conductor Class: ${designData.conductorClass}`);
        if (designData.csa) fields.push(`Cross-Sectional Area: ${designData.csa} mm²`);
        if (designData.insulationMaterial) fields.push(`Insulation Material: ${designData.insulationMaterial}`);
        if (designData.insulationThickness) fields.push(`Insulation Thickness: ${designData.insulationThickness} mm`);

        try {
            const { output } = await ai.generate({
                model: gemmaModel,
                system: `You are a Senior Cable Design Validator specializing in IEC 60502-1 and IEC 60228.
Audit designs with technical rigor using your knowledge of these standards.

STATUS DEFINITIONS:
- PASS: Meets or exceeds standard requirements.
- WARN: Data missing, ambiguous, or borderline.
- FAIL: Below minimum safety/construction requirements.

RULES:
1. Use your knowledge of IEC 60502-1 and IEC 60228 standards.
2. Cite specific Tables/Clauses when possible (e.g., "Table 5, IEC 60502-1").
3. Insulation thickness: 0.1mm below nominal is a FAIL.
4. Set confidence based on data completeness.

CRITICAL: Return actual validation data, NOT a schema definition.
You must validate the ACTUAL values provided above, not copy this example.`,
                prompt: `Validate this cable design:

${fields.join('\n')}

Return JSON in this EXACT structure (replace <values> with your actual validation results):
{
  "fields": {
    "standard": "<copy from input>",
    "voltage": "<copy from input>",
    "conductorMaterial": "<copy from input>",
    "conductorClass": "<copy from input>",
    "csa": <number from input>,
    "insulationMaterial": "<copy from input>",
    "insulationThickness": <number from input>
  },
  "validation": [
    {
      "field": "<field name you are validating>",
      "status": "<PASS or WARN or FAIL based on IEC standards>",
      "provided": <actual value from input>,
      "expected": <expected value per IEC standard>,
      "comment": "<cite specific table/clause and explain>"
    }
  ],
  "confidence": {
    "overall": <0.0 to 1.0>
  },
  "aiReasoning": "<your detailed reasoning>"
}

IMPORTANT: For 16mm² conductor, nominal insulation is 1.0mm per IEC 60502-1 Table 5. 
If provided thickness is 0.9mm, that is 0.1mm below nominal = FAIL.`,
                config: {
                    temperature: 0.0,
                    maxOutputTokens: 500,
                },
                output: { schema: ValidationResponseSchema },
            });

            if (!output) {
                throw new Error('Failed to generate validation results from AI');
            }

            return output;
        } catch (error) {
            console.error('AI Generation Error:', error);


            if (error.message?.includes('Schema validation failed')) {
                throw new Error(
                    'AI returned invalid format. The model may need more guidance or a different approach. ' +
                    'Original error: ' + error.message
                );
            }

            throw error;
        }
    }
);
