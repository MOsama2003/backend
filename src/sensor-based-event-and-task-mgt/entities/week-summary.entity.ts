import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class WeeklyFarmReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-array' })
  farmHealth: string[];

  @Column({ type: 'simple-array' })
  riskAnalysis: string[];

  @Column({ type: 'simple-array' })
  yieldForecast: string[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  deviceId: string;
}
