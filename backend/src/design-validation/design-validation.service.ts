import { Injectable } from '@nestjs/common';
import { AIGatewayService } from '../ai-gateway/ai-gateway.service';
import { ValidationRequestDto } from './dto/validation-request.dto';
import { ValidationResponseDto } from './dto/validation-response.dto';

@Injectable()
export class DesignValidationService {
    constructor(private readonly aiGatewayService: AIGatewayService) { }

    async validateDesign(
        validationRequest: ValidationRequestDto,
    ): Promise<ValidationResponseDto> {
        let designData = validationRequest.structuredInput;

        if (validationRequest.freeTextInput) {
            designData = await this.aiGatewayService.extractFields(
                validationRequest.freeTextInput,
            );
        }


        const aiValidationResult = await this.aiGatewayService.validateDesign(designData);

        return aiValidationResult;
    }
}
