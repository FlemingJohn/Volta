import { z } from './genkit-config';

/**
 * Preprocessor to handle AI returning strings for numeric fields.
 * Explicitly allows strings in the schema to pass Genkit's initial validation.
 */
const createNumericSchema = () => z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'string') {
        const clean = val.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(clean);
        return isNaN(parsed) ? undefined : parsed;
    }
    return val;
}).optional();

export const StructuredInputSchema = z.object({
    standard: z.string().optional(),
    voltage: z.string().optional(),
    conductorMaterial: z.string().optional(),
    conductorClass: z.string().optional(),
    csa: createNumericSchema(),
    insulationMaterial: z.string().optional(),
    insulationThickness: createNumericSchema(),
});


export const ValidationResponseSchema = z.object({
    fields: z.record(z.string(), z.any()),
    validation: z.array(
        z.object({
            field: z.string(),
            status: z.enum(['PASS', 'WARN', 'FAIL']),
            provided: z.any().optional(),
            expected: z.any().optional(),
            comment: z.string(),
        })
    ),
    confidence: z.object({
        overall: z.number().min(0).max(1),
    }),
    aiReasoning: z.string().optional(),
});


export const ExtractionSchema = StructuredInputSchema;

export type StructuredInput = z.infer<typeof StructuredInputSchema>;
export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;
