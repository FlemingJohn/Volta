import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { AIGatewayService } from '../ai-gateway/ai-gateway.service';
import { ValidationRequestDto } from './dto/validation-request.dto';
import { ValidationResponseDto } from './dto/validation-response.dto';
import { CableDesign } from './schemas/cable-design.schema';

@Injectable()
export class DesignValidationService {
    constructor(
        @InjectModel(CableDesign.name) private readonly cableDesignModel: Model<CableDesign>,
        private readonly aiGatewayService: AIGatewayService
    ) { }

    async validateDesign(
        validationRequest: ValidationRequestDto,
    ): Promise<ValidationResponseDto> {
        let designData = validationRequest.structuredInput;

        try {
            if (validationRequest.recordId) {
                designData = await this.resolveRecordData(validationRequest.recordId);
            }

            let result: ValidationResponseDto;

            if (validationRequest.freeTextInput) {
                result = await this.handleFreeTextValidation(validationRequest.freeTextInput);
            } else {
                result = await this.handleStructuredValidation(designData);
            }

            return await this.saveAndFormatResult(result, validationRequest.recordId, designData);

        } catch (error) {
            this.handleValidationError(error);
        }
    }

    private async resolveRecordData(recordId: string): Promise<any> {
        let fetchedRecord: any = null;

        if (isValidObjectId(recordId)) {
            fetchedRecord = await this.cableDesignModel.findById(recordId).exec();
        } else {
            fetchedRecord = await this.cableDesignModel.findOne({ _id: recordId }).exec();
        }

        if (!fetchedRecord) {
            throw new NotFoundException(`Cable record with ID ${recordId} not found.`);
        }
        return fetchedRecord.toObject();
    }

    private async handleFreeTextValidation(text: string): Promise<ValidationResponseDto> {
        if (text.includes(';')) {
            const cores = text
                .split(';')
                .map(c => c.trim())
                .filter(c => c.length > 0);

            if (cores.length >= 2) {
                return await this.aiGatewayService.validateMultiCore(text);
            }
        }

        const result = await this.aiGatewayService.validateFreeText(text);

        if (result.isInvalidInput) {
            throw new InternalServerErrorException('Invalid input, recheck the input');
        }

        return result;
    }

    private async handleStructuredValidation(designData: any): Promise<ValidationResponseDto> {
        const result = await this.aiGatewayService.validateDesign(designData);

        if (result.isInvalidInput) {
            throw new InternalServerErrorException('Invalid input, recheck the input');
        }

        return result;
    }

    private async saveAndFormatResult(
        result: ValidationResponseDto,
        recordId: string | undefined,
        designData: any
    ): Promise<ValidationResponseDto> {
        if (result.fields && !recordId) {
            const savedDesign = await this.cableDesignModel.create(result.fields);
            result.recordId = savedDesign._id.toString();
        } else if (!recordId && designData) {
            const savedDesign = await this.cableDesignModel.create(designData);
            result.recordId = savedDesign._id.toString();
        } else if (recordId) {
            result.recordId = recordId;
        }

        return result;
    }

    private handleValidationError(error: any): never {
        if (error.message === 'Invalid input, recheck the input') {
            throw error;
        }
        console.error('Validation Flow Failed:', error);

        let errorMessage = 'Validation service temporarily unavailable. Please try again.';

        if (error.message?.includes('AI returned invalid JSON')) {
            errorMessage = `AI Formatting Error: The engine returned an unreadable response. Try rephrasing or simplifying your input.`;
            if (error.stage) {
                errorMessage += ` (Failure Stage: ${error.stage})`;
            }
        } else if (error.message?.includes('Ollama failed')) {
            errorMessage = `Ollama Connection Error: ${error.message}`;
        } else if (error.message) {
            errorMessage = error.message;
        }

        throw new InternalServerErrorException(errorMessage);
    }
}
