import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { DesignValidationService } from './design-validation.service';
import { ValidationRequestDto } from './dto/validation-request.dto';
import { ValidationResponseDto } from './dto/validation-response.dto';

@Controller('design')
export class DesignValidationController {
    constructor(
        private readonly designValidationService: DesignValidationService,
    ) { }

    @Post('validate')
    async validateDesign(
        @Body(new ValidationPipe({ transform: true, whitelist: true }))
        validationRequest: ValidationRequestDto,
    ): Promise<ValidationResponseDto> {
        return this.designValidationService.validateDesign(validationRequest);
    }
}
