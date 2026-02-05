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

// Metodi preračuna (Conversion Methods)
export enum CBTMacroConversionMethod {
  ECB_RATE = "ecb-rate",
  ANNUAL_AVERAGE = "annual-average",
  SPOT_RATE = "spot-rate",
  CENTRAL_BANK = "central-bank",
  FIXED_RATE = "fixed-rate",
  OTHER = "other",
}

@Entity("cbt_macro")
export class CBTMacroEntity {
  @PrimaryColumn()
  id: string;

  // Veza sa CBT projektom
  @Column()
  projectId: string;

  @ManyToOne(() => CBTEntity, (cbt) => cbt.macros)
  @JoinColumn({ name: "projectId" })
  cbt: CBTEntity;

  // Posmatrana godina
  @Column()
  year: number;

  // BDP u posmatranoj godini (u EUR)
  @Column({ type: "decimal", precision: 20, scale: 2, nullable: true })
  gdp: number;

  // Iznos klimatskog finansiranja (u EUR)
  @Column({ type: "decimal", precision: 20, scale: 2, nullable: true })
  climateFinanceAmount: number;

  // Udio klimatskog finansiranja u BDP-u (%)
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  climateFinanceShareGdp: number;

  // Udio u državnom budžetu (%)
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  climateFinanceShareBudget: number;

  // Valuta (default: EUR)
  @Column({ default: "EUR" })
  currency: string;

  // Metod preračuna u EUR
  @Column({
    type: "enum",
    enum: CBTMacroConversionMethod,
    nullable: true,
  })
  conversionMethod: CBTMacroConversionMethod;

  // Napomena o metodologiji
  @Column({ type: "text", nullable: true })
  methodologyNote: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdTime: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedTime: Date;
}
