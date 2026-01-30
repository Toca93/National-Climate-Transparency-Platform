import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { CBTSector, FinancialInstrument, SupportType } from "../entities/cbtFinanceNeeded.entity";

export class CBTFinanceNeededDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  cbtId: string;

  @IsOptional()
  @IsEnum(CBTSector)
  @ApiPropertyOptional({ enum: CBTSector })
  sector: CBTSector;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  subsector: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  estimatedAmountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  estimatedAmountUSD: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedTimeFrame: string;

  @IsOptional()
  @IsEnum(FinancialInstrument)
  @ApiPropertyOptional({ enum: FinancialInstrument })
  financialInstrument: FinancialInstrument;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  financialInstrumentOther: string;

  @IsOptional()
  @IsEnum(SupportType)
  @ApiPropertyOptional({ enum: SupportType })
  supportType: SupportType;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  techDevContribution: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  capacityBuildingContribution: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  anchoredInNationalStrategy: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedUseImpact: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInfo: string;
}

export class CBTFinanceNeededUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  cbtId: string;

  @IsOptional()
  @IsEnum(CBTSector)
  @ApiPropertyOptional({ enum: CBTSector })
  sector: CBTSector;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  subsector: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  estimatedAmountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  estimatedAmountUSD: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedTimeFrame: string;

  @IsOptional()
  @IsEnum(FinancialInstrument)
  @ApiPropertyOptional({ enum: FinancialInstrument })
  financialInstrument: FinancialInstrument;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  financialInstrumentOther: string;

  @IsOptional()
  @IsEnum(SupportType)
  @ApiPropertyOptional({ enum: SupportType })
  supportType: SupportType;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  techDevContribution: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  capacityBuildingContribution: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  anchoredInNationalStrategy: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedUseImpact: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInfo: string;
}
