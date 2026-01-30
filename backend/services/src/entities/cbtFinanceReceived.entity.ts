import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { EntitySubject } from "./entity.subject";
import { CBTEntity } from "./cbt.entity";
import { CBTSector, FinancialInstrument, SupportType } from "./cbtFinanceNeeded.entity";

export enum FinanceChannel {
  MULTILATERAL = "Multilateral",
  BILATERAL = "Bilateral",
  REGIONAL = "Regional",
  OTHER = "Other",
}

export enum FinanceStatus {
  COMMITTED = "Committed",
  RECEIVED = "Received",
}

export enum ActivityStatus {
  PLANNED = "Planned",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
}

@Entity("cbt_finance_received")
export class CBTFinanceReceivedEntity implements EntitySubject {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  cbtId: string;

  @ManyToOne(() => CBTEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "cbtId" })
  cbt: CBTEntity;

  @Column({ nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "enum", enum: FinanceChannel, nullable: true })
  channel: FinanceChannel;

  @Column({ nullable: true })
  channelOther: string;

  @Column({ nullable: true })
  recipientEntity: string;

  @Column({ nullable: true })
  implementingEntity: string;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  amountDomestic: number;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  amountUSD: number;

  @Column({ nullable: true })
  timeFrame: string;

  @Column({ type: "enum", enum: FinancialInstrument, nullable: true })
  financialInstrument: FinancialInstrument;

  @Column({ nullable: true })
  financialInstrumentOther: string;

  @Column({ type: "enum", enum: FinanceStatus, nullable: true })
  status: FinanceStatus;

  @Column({ type: "enum", enum: SupportType, nullable: true })
  supportType: SupportType;

  @Column({ type: "enum", enum: CBTSector, nullable: true })
  sector: CBTSector;

  @Column({ nullable: true })
  subsector: string;

  @Column({ type: "boolean", default: false })
  techDevContribution: boolean;

  @Column({ type: "boolean", default: false })
  capacityBuildingContribution: boolean;

  @Column({ type: "enum", enum: ActivityStatus, nullable: true })
  activityStatus: ActivityStatus;

  @Column({ type: "text", nullable: true })
  useImpactResults: string;

  @Column({ type: "text", nullable: true })
  additionalInfo: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ type: "bigint", nullable: true })
  createdTime: number;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ type: "bigint", nullable: true })
  updatedTime: number;
}
