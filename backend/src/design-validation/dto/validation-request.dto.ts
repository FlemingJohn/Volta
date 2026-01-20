import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StructuredInputDto } from './structured-input.dto';

export class ValidationRequestDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => StructuredInputDto)
    structuredInput?: StructuredInputDto;

    @IsOptional()
    @IsString()
    freeTextInput?: string;

}
