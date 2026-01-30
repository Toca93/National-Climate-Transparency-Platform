import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { EntitySubject } from "./entity.subject";
import { CBTEntity } from "./cbt.entity";
import { FinanceChannel, ActivityStatus } from "./cbtFinanceReceived.entity";

@Entity("cbt_transparency_needed")
export class CBTTransparencyNeededEntity implements EntitySubject {
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
  objectivesDescription: string;

  @Column({ nullable: true })
  expectedTimeFrame: string;

  @Column({ nullable: true })
  recipientEntity: string;

  @Column({ type: "enum", enum: FinanceChannel, nullable: true })
  channel: FinanceChannel;

  @Column({ nullable: true })
  channelOther: string;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  amountDomestic: number;

  @Column({ type: "decimal", precision: 18, scale: 2, nullable: true })
  amountUSD: number;

  @Column({ type: "enum", enum: ActivityStatus, nullable: true })
  activityStatus: ActivityStatus;

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
