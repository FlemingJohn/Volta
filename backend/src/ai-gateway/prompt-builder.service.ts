import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptBuilderService {
    buildSystemPrompt(): string {
        return `You are an expert cable design engineer specializing in IEC 60502-1 and IEC 60228 standards.
Your task is to validate cable designs against these standards.

For each validation:
1. Analyze the provided design parameters
2. Compare against IEC requirements
3. Determine PASS, WARN, or FAIL for each parameter
4. Provide clear explanations
5. Assign a confidence score (0.0 to 1.0)

Always respond in valid JSON format with this structure:
{
  "fields": { ... extracted/provided fields ... },
  "validation": [
    {
      "field": "field_name",
      "status": "PASS|WARN|FAIL",
      "provided": "provided_value",
      "expected": "expected_value",
      "comment": "explanation"
    }
  ],
  "confidence": {
    "overall": 0.0-1.0
  }
}`;
    }

    buildValidationPrompt(designData: any): string {
        const fields = [];

        if (designData.standard) fields.push(`Standard: ${designData.standard}`);
        if (designData.voltage) fields.push(`Voltage: ${designData.voltage}`);
        if (designData.conductorMaterial) fields.push(`Conductor Material: ${designData.conductorMaterial}`);
        if (designData.conductorClass) fields.push(`Conductor Class: ${designData.conductorClass}`);
        if (designData.csa) fields.push(`Cross-Sectional Area: ${designData.csa} mm²`);
        if (designData.insulationMaterial) fields.push(`Insulation Material: ${designData.insulationMaterial}`);
        if (designData.insulationThickness) fields.push(`Insulation Thickness: ${designData.insulationThickness} mm`);

        return `Validate this cable design:

${fields.join('\n')}

Validate each parameter against IEC 60502-1 and IEC 60228.
Return validation results in JSON format as specified in the system prompt.`;
    }

    buildExtractionPrompt(freeText: string): string {
        return `Extract cable design parameters from this text:

"${freeText}"

Extract and return the following fields in JSON format:
{
  "standard": "...",
  "voltage": "...",
  "conductorMaterial": "...",
  "conductorClass": "...",
  "csa": number,
  "insulationMaterial": "...",
  "insulationThickness": number
}

If a field is not mentioned, omit it from the response.`;
    }
}
