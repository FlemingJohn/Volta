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
        // Attempt to find standards across multiple potential locations
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
                        standardsContext += `\n--- SOURCE: ${file} ---\n${content}\n`;
                    }
                }
            } else {
                console.warn(`Standards directory not found at: ${standardsDir}`);
                standardsContext = 'No external standard documents found. Use inherent knowledge of IEC 60502-1 and IEC 60228 but prioritize literal validation where possible.';
            }
        } catch (error) {
            console.error('Failed to read standards directory:', error);
            standardsContext = 'Error reading IEC standards from disk.';
        }

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
            system: `You are a Senior Cable Design Validator specializing in IEC 60502-1 and IEC 60228.
Your mission is to audit cable designs with extreme technical rigor.

AUDIT PROTOCOL:
- PASS: The value matches or exceeds the nominal requirement in the provided standard context.
- WARN: The data is missing, ambiguous, or borderline, requiring human engineering review.
- FAIL: The value is clearly below the minimum safety or construction requirement specified in the standard.

REASONING RULES:
1. You MUST use the provided STANDARDS CONTEXT as your sole authority for "Expected" values.
2. Cite specific Table or Clause numbers in your comments (e.g., "Table 5, IEC 60502-1").
3. Be pedantic about insulation thickness; even 0.1mm below nominal is a FAIL.
4. Calculate 'confidence' based on the availability and clarity of contextual data.`,
            prompt: `
--- START STANDARDS CONTEXT ---
${standardsContext}
--- END STANDARDS CONTEXT ---

AUDIT TARGET:
${fields.join('\n')}

VALIDATION COMMANDS:
1. MAP the Audit Target to the correct tables in the STANDARDS CONTEXT.
2. ASSESS each attribute. If the Context doesn't cover a specific value, default to WARN.
3. CONSTRUCT a detailed AI Reasoning summary that synthesizes the overall safety and compliance of the design.

OUTPUT FORMAT: Return a valid JSON object matching the ValidationResponseSchema.`,
            output: { schema: ValidationResponseSchema },
        });

        if (!output) {
            throw new Error('Failed to generate validation results from AI');
        }

        return output;
    }
);
