import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('food') // This creates a table named 'food' in Postgres
export class FoodEntity extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g. "Apple"

  @Column({ nullable: true })
  origin: string; // e.g. "Spain"

  @Column('int')
  calories: number; // e.g. 95
}