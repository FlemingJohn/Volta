import { IsOptional, IsString, IsNumber } from 'class-validator';

export class StructuredInputDto {
  @IsOptional()
  @IsString()
  standard?: string;

  @IsOptional()
  @IsString()
  voltage?: string;

  @IsOptional()
  @IsString()
  conductorMaterial?: string;

  @IsOptional()
  @IsString()
  conductorClass?: string;

  @IsOptional()
  @IsNumber()
  csa?: number;

  @IsOptional()
  @IsString()
  insulationMaterial?: string;

  @IsOptional()
  @IsNumber()
  insulationThickness?: number;

  @IsOptional()
  @IsString()
  maxResistance?: string;
}
