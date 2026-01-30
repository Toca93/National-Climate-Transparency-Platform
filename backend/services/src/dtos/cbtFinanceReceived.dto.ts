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
import { FinanceChannel, FinanceStatus, ActivityStatus } from "../entities/cbtFinanceReceived.entity";

export class CBTFinanceReceivedDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  cbtId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @IsEnum(FinanceChannel)
  @ApiPropertyOptional({ enum: FinanceChannel })
  channel: FinanceChannel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  channelOther: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  implementingEntity: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountUSD: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  timeFrame: string;

  @IsOptional()
  @IsEnum(FinancialInstrument)
  @ApiPropertyOptional({ enum: FinancialInstrument })
  financialInstrument: FinancialInstrument;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  financialInstrumentOther: string;

  @IsOptional()
  @IsEnum(FinanceStatus)
  @ApiPropertyOptional({ enum: FinanceStatus })
  status: FinanceStatus;

  @IsOptional()
  @IsEnum(SupportType)
  @ApiPropertyOptional({ enum: SupportType })
  supportType: SupportType;

  @IsOptional()
  @IsEnum(CBTSector)
  @ApiPropertyOptional({ enum: CBTSector })
  sector: CBTSector;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  subsector: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  techDevContribution: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  capacityBuildingContribution: boolean;

  @IsOptional()
  @IsEnum(ActivityStatus)
  @ApiPropertyOptional({ enum: ActivityStatus })
  activityStatus: ActivityStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  useImpactResults: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInfo: string;
}

export class CBTFinanceReceivedUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  cbtId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description: string;

  @IsOptional()
  @IsEnum(FinanceChannel)
  @ApiPropertyOptional({ enum: FinanceChannel })
  channel: FinanceChannel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  channelOther: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  implementingEntity: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountUSD: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  timeFrame: string;

  @IsOptional()
  @IsEnum(FinancialInstrument)
  @ApiPropertyOptional({ enum: FinancialInstrument })
  financialInstrument: FinancialInstrument;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  financialInstrumentOther: string;

  @IsOptional()
  @IsEnum(FinanceStatus)
  @ApiPropertyOptional({ enum: FinanceStatus })
  status: FinanceStatus;

  @IsOptional()
  @IsEnum(SupportType)
  @ApiPropertyOptional({ enum: SupportType })
  supportType: SupportType;

  @IsOptional()
  @IsEnum(CBTSector)
  @ApiPropertyOptional({ enum: CBTSector })
  sector: CBTSector;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  subsector: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  techDevContribution: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  capacityBuildingContribution: boolean;

  @IsOptional()
  @IsEnum(ActivityStatus)
  @ApiPropertyOptional({ enum: ActivityStatus })
  activityStatus: ActivityStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  useImpactResults: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInfo: string;
}
