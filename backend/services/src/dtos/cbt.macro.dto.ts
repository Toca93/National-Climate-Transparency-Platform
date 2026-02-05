import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { CBTMacroConversionMethod } from "../entities/cbt.macro.entity";

export class CBTMacroDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  year: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional()
  gdp: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional()
  climateFinanceAmount: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiPropertyOptional()
  climateFinanceShareGdp: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiPropertyOptional()
  climateFinanceShareBudget: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: "EUR" })
  currency: string;

  @IsOptional()
  @IsEnum(CBTMacroConversionMethod, {
    message:
      "Invalid Conversion Method. Supported values: " +
      Object.values(CBTMacroConversionMethod),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTMacroConversionMethod),
  })
  conversionMethod: CBTMacroConversionMethod;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  methodologyNote: string;
}

export class CBTMacroUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  projectId: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  year: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional()
  gdp: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional()
  climateFinanceAmount: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiPropertyOptional()
  climateFinanceShareGdp: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiPropertyOptional()
  climateFinanceShareBudget: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  currency: string;

  @IsOptional()
  @IsEnum(CBTMacroConversionMethod, {
    message:
      "Invalid Conversion Method. Supported values: " +
      Object.values(CBTMacroConversionMethod),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTMacroConversionMethod),
  })
  conversionMethod: CBTMacroConversionMethod;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  methodologyNote: string;
}
