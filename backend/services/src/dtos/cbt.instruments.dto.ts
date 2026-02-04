import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CBTInstrumentsDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectId: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  exchangeRate: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  convertedAmount: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  nationalComponent: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  internationalComponent: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInformation: string;
}

export class CBTInstrumentsUpdateDto {
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
  exchangeRate: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  convertedAmount: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  nationalComponent: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  internationalComponent: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInformation: string;
}
