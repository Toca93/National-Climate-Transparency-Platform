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

@Entity("cbt_instruments")
export class CBTInstrumentsEntity {
  @PrimaryColumn()
  id: string;

  // Veza sa CBT projektom
  @Column()
  projectId: string;

  @ManyToOne(() => CBTEntity, (cbt) => cbt.instruments)
  @JoinColumn({ name: "projectId" })
  cbt: CBTEntity;

  // Kurs EUR/USD
  @Column({ type: "decimal", precision: 10, scale: 4, nullable: true })
  exchangeRate: number;

  // Ukupan iznos u EUR
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  totalAmount: number;

  // Konvertovani iznos u USD
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  convertedAmount: number;

  // Nacionalna komponenta u EUR
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  nationalComponent: number;

  // Međunarodna komponenta u EUR
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  internationalComponent: number;

  // Dodatne informacije
  @Column({ type: "text", nullable: true })
  additionalInformation: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdTime: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedTime: Date;
}
