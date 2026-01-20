import { IsObject, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FieldValidationDto } from './field-validation.dto';

export class ValidationResponseDto {
    @IsObject()
    fields: Record<string, any>;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FieldValidationDto)
    validation: FieldValidationDto[];

    @IsObject()
    confidence: {
        overall: number;
    };

    @IsOptional()
    @IsString()
    aiReasoning?: string;
}
