import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Sector } from "../enums/sector.enum";
import { SubSector } from "../enums/shared.enum";
import { CBTFundingEntity } from "./cbt.funding.entity";
import { CBTInstrumentsEntity } from "./cbt.instruments.entity";

// Status projekta klimatskog finansiranja (H1)
export enum CBTStatus {
  PLANNED = "Planned",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
}

// H7: Status verifikacije
export enum CBTVerificationStatus {
  UNVERIFIED = "Unverified",
  INTERNALLY_VERIFIED = "InternallyVerified",
  BTR_READY = "BTRReady",
}

// Tip finansijske podrške
export enum CBTTypeOfSupport {
  ADAPTATION = "Adaptation",
  MITIGATION = "Mitigation",
  CROSS_CUTTING = "CrossCutting",
}

// Da/Ne opcije
export enum CBTYesNo {
  YES = "Yes",
  NO = "No",
}

@Entity("cbt")
export class CBTEntity {
  @PrimaryColumn()
  id: string;

  // H1 - Osnovne informacije
  @Column({ nullable: true })
  projectName: string;

  @Column({ type: "int", nullable: true })
  startYear: number;

  @Column({ type: "int", nullable: true })
  endYear: number;

  @Column({ type: "text", nullable: true })
  activityDescription: string;

  @Column({ nullable: true })
  responsibleInstitution: string;

  @Column({ nullable: true })
  recipientEntity: string;

  @Column({ type: "enum", enum: CBTStatus, default: CBTStatus.PLANNED, nullable: true })
  status: CBTStatus;

  // ETF klasifikacija
  @Column({ type: "enum", enum: Sector, nullable: true })
  sector: Sector;

  @Column({ type: "enum", enum: SubSector, array: true, nullable: true })
  subSector: SubSector[];

  @Column({ nullable: true })
  otherSectorText: string;

  @Column({ type: "enum", enum: CBTYesNo, nullable: true })
  basedOnNDC: CBTYesNo;

  @Column({ type: "enum", enum: CBTYesNo, nullable: true })
  technologyTransferContribution: CBTYesNo;

  @Column({ type: "enum", enum: CBTYesNo, nullable: true })
  capacityBuildingContribution: CBTYesNo;

  @Column({ type: "enum", enum: CBTTypeOfSupport, nullable: true })
  typeOfSupport: CBTTypeOfSupport;

  @Column({ type: "text", nullable: true })
  additionalInformation: string;

  // H7 - Dokumentacija i verifikacija
  @Column({
    type: "enum",
    enum: CBTVerificationStatus,
    default: CBTVerificationStatus.UNVERIFIED,
    nullable: true,
  })
  verificationStatus: CBTVerificationStatus;

  @Column({ nullable: true })
  verificationNote: string;

  @Column({ type: "text", array: true, nullable: true })
  documents: string[];

  // Relationships
  @OneToMany(() => CBTFundingEntity, (funding) => funding.cbt)
  fundings: CBTFundingEntity[];

  @OneToMany(() => CBTInstrumentsEntity, (instruments) => instruments.cbt)
  instruments: CBTInstrumentsEntity[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdTime: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedTime: Date;
}
