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
            try {
                // Check for multi-core input (semicolon-separated)
                if (validationRequest.freeTextInput.includes(';')) {
                    const cores = validationRequest.freeTextInput
                        .split(';')
                        .map(c => c.trim())
                        .filter(c => c.length > 0);

                    // If we have 2+ cores, route to multi-core flow
                    if (cores.length >= 2) {
                        const multiCoreResult = await this.aiGatewayService.validateMultiCore(
                            validationRequest.freeTextInput,
                        );
                        return multiCoreResult;
                    }
                }

                // Single-core free-text validation
                const aiValidationResult = await this.aiGatewayService.validateFreeText(
                    validationRequest.freeTextInput,
                );

                if (aiValidationResult.isInvalidInput) {
                    throw new InternalServerErrorException('Invalid input, recheck the input');
                }


                if (aiValidationResult.fields) {
                    const savedDesign = await this.cableDesignModel.create(aiValidationResult.fields);
                    aiValidationResult.recordId = savedDesign._id.toString();
                }

                return aiValidationResult;
            } catch (error) {
                if (error.message === 'Invalid input, recheck the input') {
                    throw error;
                }
                console.error('Unified Validation Failed:', error);

                const errorMessage = error.message?.includes('AI returned invalid JSON')
                    ? `AI Formatting Error: The engine returned an unreadable response. Try rephrasing or simplifying your input.`
                    : error.message || 'Validation failed. Please check your input and try again.';

                throw new InternalServerErrorException(errorMessage);
            }
        }


        try {
            const aiValidationResult = await this.aiGatewayService.validateDesign(designData);

            if (aiValidationResult.isInvalidInput) {
                throw new InternalServerErrorException('Invalid input, recheck the input');
            }


            if (!validationRequest.recordId && designData) {
                const savedDesign = await this.cableDesignModel.create(designData);
                aiValidationResult.recordId = savedDesign._id.toString();
            } else if (validationRequest.recordId) {
                aiValidationResult.recordId = validationRequest.recordId;
            }

            return aiValidationResult;
        } catch (error) {
            if (error.message === 'Invalid input, recheck the input') {
                throw error;
            }
            console.error('Validation Flow Failed:', error);

            let errorMessage = 'Validation service temporarily unavailable. Please try again.';

            if (error.message?.includes('AI returned invalid JSON')) {
                errorMessage = `AI Formatting Error: The engine returned an unreadable response. Please check your engineering parameters.`;
            } else if (error.message?.includes('Ollama failed')) {
                errorMessage = `Ollama Connection Error: ${error.message}`;
            } else if (error.message) {
                errorMessage = error.message;
            }

            throw new InternalServerErrorException(errorMessage);
        }
    }
}
