import { z } from 'zod';

const createNumericSchema = () => z.any().transform((val) => {

    const actualVal = Array.isArray(val) ? val[0] : val;

    if (typeof actualVal === 'string') {
        const clean = actualVal.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(clean);
        return isNaN(parsed) ? undefined : parsed;
    }

    if (typeof actualVal === 'number') {
        return actualVal;
    }

    return undefined;
}).optional();

export const StructuredInputSchema = z.object({
    isInvalidInput: z.boolean().optional(),
    standard: z.string().optional(),
    voltage: z.string().optional(),
    conductorMaterial: z.string().optional(),
    conductorClass: z.any().transform(val => val?.toString()).optional(),
    csa: createNumericSchema(),
    insulationMaterial: z.string().optional(),
    insulationThickness: createNumericSchema(),
    maxResistance: z.string().optional(),
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
    isInvalidInput: z.boolean().optional(),
});


export const ExtractionSchema = StructuredInputSchema;

export type StructuredInput = z.infer<typeof StructuredInputSchema>;
export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;
