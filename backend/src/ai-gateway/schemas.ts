import { z } from 'zod';

export const StructuredInputSchema = z.object({
    standard: z.string().optional(),
    voltage: z.string().optional(),
    conductorMaterial: z.string().optional(),
    conductorClass: z.string().optional(),
    csa: z.number().optional(),
    insulationMaterial: z.string().optional(),
    insulationThickness: z.number().optional(),
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
