import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

// Status projekta klimatskog finansiranja
export enum CBTStatus {
  PLANNED = "Planned",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

// H7: Status verifikacije
export enum CBTVerificationStatus {
  UNVERIFIED = "Unverified",
  INTERNALLY_VERIFIED = "InternallyVerified",
  BTR_READY = "BTRReady",
}

@Entity("cbt")
export class CBTEntity {
  @PrimaryColumn()
  id: string;

  // H1 - Osnovne informacije
  @Column()
  reportingYear: number;

  @Column()
  projectName: string;

  @Column({ type: "text", nullable: true })
  activityDescription: string;

  @Column({ nullable: true })
  responsibleInstitution: string;

  @Column({ type: "enum", enum: CBTStatus, default: CBTStatus.PLANNED })
  status: CBTStatus;

  // Validacija
  @Column({ type: "boolean", default: false })
  validated: boolean;

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
  contractDocuments: string[];

  @Column({ type: "text", array: true, nullable: true })
  governmentDecisionDocuments: string[];

  @Column({ type: "text", array: true, nullable: true })
  donorAgreementDocuments: string[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdTime: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedTime: Date;
}
