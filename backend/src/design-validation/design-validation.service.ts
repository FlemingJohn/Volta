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
                const aiValidationResult = await this.aiGatewayService.validateFreeText(
                    validationRequest.freeTextInput,
                );

                if (aiValidationResult.isInvalidInput) {
                    throw new InternalServerErrorException('Invalid input, recheck the input');
                }

                // Store the design data extracted from free text
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
                throw new InternalServerErrorException(
                    'Validation failed. Please check your input and try again.'
                );
            }
        }


        try {
            const aiValidationResult = await this.aiGatewayService.validateDesign(designData);

            if (aiValidationResult.isInvalidInput) {
                throw new InternalServerErrorException('Invalid input, recheck the input');
            }

            // Store structured design if it's not already from a record
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

            if (error.message?.includes('check your input')) {
                throw new InternalServerErrorException(
                    'Validation failed. Please check your input and try again. If the issue persists, contact support.'
                );
            }

            throw new InternalServerErrorException(
                'Validation service temporarily unavailable. Please try again.'
            );
        }
    }
}
