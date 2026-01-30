import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { EntitySubject } from "./entity.subject";
import { CBTEntity } from "./cbt.entity";

export enum CBTSector {
  ENERGY = "Energy",
  TRANSPORT = "Transport",
  INDUSTRY = "Industry",
  AGRICULTURE = "Agriculture",
  FORESTRY = "Forestry",
  WATER_AND_SANITATION = "WaterAndSanitation",
  CROSS_CUTTING = "CrossCutting",
  OTHER = "Other",
}

export enum FinancialInstrument {
  GRANT = "Grant",
  CONCESSIONAL_LOAN = "ConcessionalLoan",
  NON_CONCESSIONAL_LOAN = "NonConcessionalLoan",
  EQUITY = "Equity",
  GUARANTEE = "Guarantee",
  INSURANCE = "Insurance",
  OTHER = "Other",
}

export enum SupportType {
  ADAPTATION = "Adaptation",
  MITIGATION = "Mitigation",
  CROSS_CUTTING = "CrossCutting",
}

@Entity("cbt_finance_needed")
export class CBTFinanceNeededEntity implements EntitySubject {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  cbtId: string;

  @ManyToOne(() => CBTEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "cbtId" })
  cbt: CBTEntity;

  @Column({ type: "enum", enum: CBTSector, nullable: true })
  sector: CBTSector;

  @Column({ nullable: true })
  subsector: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  estimatedAmountDomestic: number;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  estimatedAmountUSD: number;

  @Column({ nullable: true })
  expectedTimeFrame: string;

  @Column({ type: "enum", enum: FinancialInstrument, nullable: true })
  financialInstrument: FinancialInstrument;

  @Column({ nullable: true })
  financialInstrumentOther: string;

  @Column({ type: "enum", enum: SupportType, nullable: true })
  supportType: SupportType;

  @Column({ type: "boolean", default: false })
  techDevContribution: boolean;

  @Column({ type: "boolean", default: false })
  capacityBuildingContribution: boolean;

  @Column({ type: "boolean", default: false })
  anchoredInNationalStrategy: boolean;

  @Column({ type: "text", nullable: true })
  expectedUseImpact: string;

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
