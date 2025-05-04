import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class WeeklyFarmReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-array', nullable: true })
  farmHealth: string[];

  @Column({ type: 'simple-array',nullable: true })
  riskAnalysis: string[];

  @Column({ type: 'simple-array',nullable: true })
  yieldForecast: string[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  deviceId: string;
}
