import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from "class-validator";
import { CBTStatus } from "../entities/cbt.entity";

export class CBTDto {
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2010)
  @Max(2050)
  @ApiProperty()
  reportingYear: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  projectName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  activityDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  responsibleInstitution: string;

  @IsNotEmpty()
  @IsEnum(CBTStatus, {
    message:
      "Invalid Status. Supported following status: " + Object.values(CBTStatus),
  })
  @ApiProperty({
    enum: Object.values(CBTStatus),
  })
  status: CBTStatus;
}

export class CBTUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsNumber()
  @Min(2010)
  @Max(2050)
  @ApiPropertyOptional()
  reportingYear: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  projectName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  activityDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  responsibleInstitution: string;

  @IsOptional()
  @IsEnum(CBTStatus, {
    message:
      "Invalid Status. Supported following status: " + Object.values(CBTStatus),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTStatus),
  })
  status: CBTStatus;
}
