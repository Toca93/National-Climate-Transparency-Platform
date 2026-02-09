import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

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
}
