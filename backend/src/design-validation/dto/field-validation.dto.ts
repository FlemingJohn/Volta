import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ValidationStatus {
    PASS = 'PASS',
    WARN = 'WARN',
    FAIL = 'FAIL',
}

export class FieldValidationDto {
    @IsString()
    field: string;

    @IsEnum(ValidationStatus)
    status: ValidationStatus;

    @IsOptional()
    provided?: any;

    @IsOptional()
    expected?: any;

    @IsString()
    comment: string;
}
