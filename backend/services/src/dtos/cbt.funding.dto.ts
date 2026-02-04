import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import {
  CBTFundingInstrument,
  CBTFundingStatus,
  CBTSupportNeededOrReceived,
  CBTFundingMethod,
} from "../entities/cbt.funding.entity";

export class CBTFundingDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectId: string;

  @IsOptional()
  @IsEnum(CBTFundingInstrument, {
    message:
      "Invalid Financial Instrument. Supported values: " +
      Object.values(CBTFundingInstrument),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTFundingInstrument),
  })
  financialInstrument: CBTFundingInstrument;

  @IsOptional()
  @IsEnum(CBTFundingStatus, {
    message:
      "Invalid Status. Supported values: " + Object.values(CBTFundingStatus),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTFundingStatus),
  })
  status: CBTFundingStatus;

  @IsOptional()
  @IsEnum(CBTSupportNeededOrReceived, {
    message:
      "Invalid Support Type. Supported values: " +
      Object.values(CBTSupportNeededOrReceived),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTSupportNeededOrReceived),
  })
  supportNeededOrReceived: CBTSupportNeededOrReceived;

  @IsOptional()
  @IsEnum(CBTFundingMethod, {
    message:
      "Invalid Funding Method. Supported values: " +
      Object.values(CBTFundingMethod),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTFundingMethod),
  })
  fundingMethod: CBTFundingMethod;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  otherFundingMethodText: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedImpact: string;
}

export class CBTFundingUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  projectId: string;

  @IsOptional()
  @IsEnum(CBTFundingInstrument, {
    message:
      "Invalid Financial Instrument. Supported values: " +
      Object.values(CBTFundingInstrument),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTFundingInstrument),
  })
  financialInstrument: CBTFundingInstrument;

  @IsOptional()
  @IsEnum(CBTFundingStatus, {
    message:
      "Invalid Status. Supported values: " + Object.values(CBTFundingStatus),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTFundingStatus),
  })
  status: CBTFundingStatus;

  @IsOptional()
  @IsEnum(CBTSupportNeededOrReceived, {
    message:
      "Invalid Support Type. Supported values: " +
      Object.values(CBTSupportNeededOrReceived),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTSupportNeededOrReceived),
  })
  supportNeededOrReceived: CBTSupportNeededOrReceived;

  @IsOptional()
  @IsEnum(CBTFundingMethod, {
    message:
      "Invalid Funding Method. Supported values: " +
      Object.values(CBTFundingMethod),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTFundingMethod),
  })
  fundingMethod: CBTFundingMethod;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  otherFundingMethodText: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  expectedImpact: string;
}
