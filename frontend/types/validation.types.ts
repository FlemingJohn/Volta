export interface StructuredInput {
    standard?: string;
    voltage?: string;
    conductorMaterial?: string;
    conductorClass?: string;
    csa?: number;
    insulationMaterial?: string;
    insulationThickness?: number;
}

export interface ValidationRequest {
    structuredInput?: StructuredInput;
    freeTextInput?: string;
    recordId?: string;
}

export type ValidationStatus = 'PASS' | 'WARN' | 'FAIL';

export interface FieldValidation {
    field: string;
    status: ValidationStatus;
    provided?: any;
    expected?: any;
    comment: string;
}

export interface ValidationResponse {
    fields: Record<string, any>;
    validation: FieldValidation[];
    confidence: {
        overall: number;
    };
    aiReasoning?: string;
}
