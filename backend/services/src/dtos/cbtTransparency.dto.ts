import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { FinanceChannel, ActivityStatus } from "../entities/cbtFinanceReceived.entity";

// Table III.12 - Transparency Support Needed
export class CBTTransparencyNeededDto {
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
  objectivesDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedTimeFrame: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsEnum(FinanceChannel)
  @ApiPropertyOptional({ enum: FinanceChannel })
  channel: FinanceChannel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  channelOther: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountUSD: number;

  @IsOptional()
  @IsEnum(ActivityStatus)
  @ApiPropertyOptional({ enum: ActivityStatus })
  activityStatus: ActivityStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedUseImpact: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInfo: string;
}

export class CBTTransparencyNeededUpdateDto {
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
  objectivesDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedTimeFrame: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsEnum(FinanceChannel)
  @ApiPropertyOptional({ enum: FinanceChannel })
  channel: FinanceChannel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  channelOther: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountUSD: number;

  @IsOptional()
  @IsEnum(ActivityStatus)
  @ApiPropertyOptional({ enum: ActivityStatus })
  activityStatus: ActivityStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedUseImpact: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInfo: string;
}

// Table III.13 - Transparency Support Received
export class CBTTransparencyReceivedDto {
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
  objectivesDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  timeFrame: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsEnum(FinanceChannel)
  @ApiPropertyOptional({ enum: FinanceChannel })
  channel: FinanceChannel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  channelOther: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountUSD: number;

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

export class CBTTransparencyReceivedUpdateDto {
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
  objectivesDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  timeFrame: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsEnum(FinanceChannel)
  @ApiPropertyOptional({ enum: FinanceChannel })
  channel: FinanceChannel;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  channelOther: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountDomestic: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  amountUSD: number;

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
