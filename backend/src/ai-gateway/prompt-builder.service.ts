import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptBuilderService {
    buildSystemPrompt(): string {
        return `You are an expert cable design engineer. Validate the design against IEC 60502-1 and IEC 60228.
Always respond in this JSON format:
{
  "fields": { "standard": "...", "voltage": "...", "conductorMaterial": "...", "conductorClass": "...", "csa": 0, "insulationMaterial": "...", "insulationThickness": 0 },
  "validation": [
    { "field": "...", "status": "PASS/WARN/FAIL", "provided": "...", "expected": "...", "comment": "..." }
  ],
  "confidence": { "overall": 0.0-1.0 },
  "aiReasoning": "A high-level engineering summary of the validation decisions."
}`;
    }

    buildValidationPrompt(designData: any): string {
        const fields: string[] = [];

        if (designData.standard) fields.push(`Standard: ${designData.standard}`);
        if (designData.voltage) fields.push(`Voltage: ${designData.voltage}`);
        if (designData.conductorMaterial) fields.push(`Conductor Material: ${designData.conductorMaterial}`);
        if (designData.conductorClass) fields.push(`Conductor Class: ${designData.conductorClass}`);
        if (designData.csa) fields.push(`Cross-Sectional Area: ${designData.csa} mm²`);
        if (designData.insulationMaterial) fields.push(`Insulation Material: ${designData.insulationMaterial}`);
        if (designData.insulationThickness) fields.push(`Insulation Thickness: ${designData.insulationThickness} mm`);

        return `Validate this cable design strictly against IEC 60502-1 and IEC 60228 requirements:

${fields.join('\n')}

VALIDATION RULES:
1. IEC 60502-1 specifies nominal insulation thickness. For example, for PVC at 1.5-10 mm², it's typically 0.8mm or 1.0mm depending on voltage.
2. IEC 60228 specifies conductor requirements.
3. If a provided value is significantly below nominal, it must be a FAIL.
4. If it's marginally below or unusual but technically possible, it's a WARN.
5. If it matches or exceeds requirements, it's a PASS.

BE CRITICAL. Do not just approve every value. If you are unsure of the exact table value, use your engineering knowledge to estimate the nominal requirement for the given voltage and CSA.

Return results in JSON format with status PASS, WARN, or FAIL.`;
    }

    buildExtractionPrompt(freeText: string): string {
        return `Extract cable design parameters from this technical text:

"${freeText}"

Extract and return the following fields. If a field is not mentioned or unknown, OMIT IT from the JSON response entirely. Do not use placeholders like "..." or type names like "number".

Fields to extract:
- standard (string)
- voltage (string)
- conductorMaterial (string)
- conductorClass (string)
- csa (number)
- insulationMaterial (string)
- insulationThickness (number)

IMPORTANT: Your response must be a single, valid JSON object only.`;
    }
}
