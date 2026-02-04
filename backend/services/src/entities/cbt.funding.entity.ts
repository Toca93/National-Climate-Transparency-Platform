import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { CBTEntity } from "./cbt.entity";

// Predviđeni finansijski instrumenti (Planned Financial Instruments)
export enum CBTFundingInstrument {
  GRANT = "grant",
  CONCESSIONAL_LOAN = "concessional-loan",
  NON_CONCESSIONAL_LOAN = "non-concessional-loan",
  EQUITY = "equity",
  GUARANTEE = "guarantee",
  INSURANCE = "insurance",
  OTHER = "other",
}

// Status finansiranja
export enum CBTFundingStatus {
  COMMITTED = "Committed",
  RECEIVED = "Received",
}

// Support Needed or Received
export enum CBTSupportNeededOrReceived {
  NEEDED = "Needed",
  RECEIVED = "Received",
}

// Način finansiranja (Funding Method)
export enum CBTFundingMethod {
  MULTILATERAL = "Multilateral",
  BILATERAL = "Bilateral",
  REGIONAL = "Regional",
  OTHER = "Other",
}

@Entity("cbt_funding")
export class CBTFundingEntity {
  @PrimaryColumn()
  id: string;

  // Veza sa CBT projektom
  @Column()
  projectId: string;

  @ManyToOne(() => CBTEntity, (cbt) => cbt.fundings)
  @JoinColumn({ name: "projectId" })
  cbt: CBTEntity;

  // Predviđeni finansijski instrument
  @Column({ type: "enum", enum: CBTFundingInstrument, nullable: true })
  financialInstrument: CBTFundingInstrument;

  // Status
  @Column({ type: "enum", enum: CBTFundingStatus, nullable: true })
  status: CBTFundingStatus;

  // Support Needed or Received
  @Column({ type: "enum", enum: CBTSupportNeededOrReceived, nullable: true })
  supportNeededOrReceived: CBTSupportNeededOrReceived;

  // Način finansiranja
  @Column({ type: "enum", enum: CBTFundingMethod, nullable: true })
  fundingMethod: CBTFundingMethod;

  // Drugi način finansiranja (kada je izabran Other)
  @Column({ nullable: true })
  otherFundingMethodText: string;

  // Očekivana upotreba, uticaj i procijenjeni rezultati
  @Column({ type: "text", nullable: true })
  expectedImpact: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdTime: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedTime: Date;
}
