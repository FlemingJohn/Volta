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
    fields: StructuredInputSchema,
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

// Multi-Core Validation Schemas
export const CoreValidationResultSchema = z.object({
    coreId: z.string(),
    fields: StructuredInputSchema,
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

export const ValidationSummarySchema = z.object({
    totalCores: z.number(),
    passed: z.number(),
    warned: z.number(),
    failed: z.number(),
    overallStatus: z.enum(['PASS', 'WARN', 'FAIL']),
});

export const MultiCoreValidationResponseSchema = z.object({
    cores: z.array(CoreValidationResultSchema),
    summary: ValidationSummarySchema,
});

export type StructuredInput = z.infer<typeof StructuredInputSchema>;
export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;
export type CoreValidationResult = z.infer<typeof CoreValidationResultSchema>;
export type ValidationSummary = z.infer<typeof ValidationSummarySchema>;
export type MultiCoreValidationResponse = z.infer<typeof MultiCoreValidationResponseSchema>;
