import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from "class-validator";
import { Sector } from "../enums/sector.enum";
import { SubSector } from "../enums/shared.enum";
import { CBTStatus, CBTVerificationStatus, CBTTypeOfSupport, CBTYesNo } from "../entities/cbt.entity";

export class CBTDto {
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  projectName: string;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @ApiPropertyOptional()
  startYear: number;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @ApiPropertyOptional()
  endYear: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  activityDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  responsibleInstitution: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsEnum(CBTStatus, {
    message:
      "Invalid Status. Supported following status: " + Object.values(CBTStatus),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTStatus),
  })
  status: CBTStatus;

  // ETF klasifikacija
  @IsOptional()
  @IsEnum(Sector, {
    message:
      "Invalid Sector. Supported following sectors: " + Object.values(Sector),
  })
  @ApiPropertyOptional({
    enum: Object.values(Sector),
  })
  sector: Sector;

  @IsOptional()
  @IsArray()
  @IsEnum(SubSector, {
    each: true,
    message:
      "Invalid SubSector. Supported following subsectors: " + Object.values(SubSector),
  })
  @ApiPropertyOptional({
    enum: Object.values(SubSector),
    isArray: true,
  })
  subSector: SubSector[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  otherSectorText: string;

  @IsOptional()
  @IsEnum(CBTYesNo, {
    message:
      "Invalid value. Supported values: " + Object.values(CBTYesNo),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTYesNo),
  })
  basedOnNDC: CBTYesNo;

  @IsOptional()
  @IsEnum(CBTYesNo, {
    message:
      "Invalid value. Supported values: " + Object.values(CBTYesNo),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTYesNo),
  })
  technologyTransferContribution: CBTYesNo;

  @IsOptional()
  @IsEnum(CBTYesNo, {
    message:
      "Invalid value. Supported values: " + Object.values(CBTYesNo),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTYesNo),
  })
  capacityBuildingContribution: CBTYesNo;

  @IsOptional()
  @IsEnum(CBTTypeOfSupport, {
    message:
      "Invalid Type of Support. Supported values: " + Object.values(CBTTypeOfSupport),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTTypeOfSupport),
  })
  typeOfSupport: CBTTypeOfSupport;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInformation: string;

  // H7 - Dokumentacija i verifikacija
  @IsOptional()
  @IsEnum(CBTVerificationStatus, {
    message:
      "Invalid Verification Status. Supported following status: " +
      Object.values(CBTVerificationStatus),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTVerificationStatus),
  })
  verificationStatus: CBTVerificationStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  verificationNote: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  documents: any[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  nationalImplementingEntities: string[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  internationalImplementingEntities: string[];
}

export class CBTUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  projectName: string;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @ApiPropertyOptional()
  startYear: number;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @ApiPropertyOptional()
  endYear: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  activityDescription: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  responsibleInstitution: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  recipientEntity: string;

  @IsOptional()
  @IsEnum(CBTStatus, {
    message:
      "Invalid Status. Supported following status: " + Object.values(CBTStatus),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTStatus),
  })
  status: CBTStatus;

  // ETF klasifikacija
  @IsOptional()
  @IsEnum(Sector, {
    message:
      "Invalid Sector. Supported following sectors: " + Object.values(Sector),
  })
  @ApiPropertyOptional({
    enum: Object.values(Sector),
  })
  sector: Sector;

  @IsOptional()
  @IsArray()
  @IsEnum(SubSector, {
    each: true,
    message:
      "Invalid SubSector. Supported following subsectors: " + Object.values(SubSector),
  })
  @ApiPropertyOptional({
    enum: Object.values(SubSector),
    isArray: true,
  })
  subSector: SubSector[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  otherSectorText: string;

  @IsOptional()
  @IsEnum(CBTYesNo, {
    message:
      "Invalid value. Supported values: " + Object.values(CBTYesNo),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTYesNo),
  })
  basedOnNDC: CBTYesNo;

  @IsOptional()
  @IsEnum(CBTYesNo, {
    message:
      "Invalid value. Supported values: " + Object.values(CBTYesNo),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTYesNo),
  })
  technologyTransferContribution: CBTYesNo;

  @IsOptional()
  @IsEnum(CBTYesNo, {
    message:
      "Invalid value. Supported values: " + Object.values(CBTYesNo),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTYesNo),
  })
  capacityBuildingContribution: CBTYesNo;

  @IsOptional()
  @IsEnum(CBTTypeOfSupport, {
    message:
      "Invalid Type of Support. Supported values: " + Object.values(CBTTypeOfSupport),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTTypeOfSupport),
  })
  typeOfSupport: CBTTypeOfSupport;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  additionalInformation: string;

  // H7 - Dokumentacija i verifikacija
  @IsOptional()
  @IsEnum(CBTVerificationStatus, {
    message:
      "Invalid Verification Status. Supported following status: " +
      Object.values(CBTVerificationStatus),
  })
  @ApiPropertyOptional({
    enum: Object.values(CBTVerificationStatus),
  })
  verificationStatus: CBTVerificationStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  verificationNote: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  documents: any[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  newDocuments: any[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  removedDocuments: string[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  nationalImplementingEntities: string[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  internationalImplementingEntities: string[];
}
