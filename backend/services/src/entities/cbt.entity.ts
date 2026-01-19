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

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdTime: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedTime: Date;
}
