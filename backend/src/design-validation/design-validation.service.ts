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


        if (validationRequest.recordId) {
            let fetchedRecord: any = null;

            if (isValidObjectId(validationRequest.recordId)) {
                fetchedRecord = await this.cableDesignModel.findById(validationRequest.recordId).exec();
            } else {
                fetchedRecord = await this.cableDesignModel.findOne({ _id: validationRequest.recordId }).exec();
            }

            if (!fetchedRecord) {
                throw new NotFoundException(`Cable record with ID ${validationRequest.recordId} not found.`);
            }
            designData = fetchedRecord.toObject();
        }


        if (validationRequest.freeTextInput) {
            designData = await this.aiGatewayService.extractFields(
                validationRequest.freeTextInput,
            );
        }


        try {
            const aiValidationResult = await this.aiGatewayService.validateDesign(designData);
            return aiValidationResult;
        } catch (error) {
            console.error('Validation Flow Failed:', error);

            // Handle Ollama memory errors
            if (error.message?.includes('memory layout cannot be allocated')) {
                throw new InternalServerErrorException(
                    'AI model out of memory. The system requires more RAM to process this request. ' +
                    'Please try again or contact support if the issue persists.'
                );
            }

            // Handle schema validation errors
            if (error.message?.includes('Schema validation failed')) {
                throw new InternalServerErrorException(
                    'AI returned invalid response format. The model may be overloaded. ' +
                    'Please try again in a moment.'
                );
            }

            // Handle model not found errors
            if (error.message?.includes('model') && error.message?.includes('not found')) {
                throw new InternalServerErrorException(
                    'AI model not available. Please ensure Ollama is running with the required model.'
                );
            }

            // Generic AI error
            throw new InternalServerErrorException(
                `Validation failed: ${error.message || 'Unknown AI error occurred'}`
            );
        }
    }
}
