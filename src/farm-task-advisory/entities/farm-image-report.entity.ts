// entities/farm-image-report.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Farm } from './farm.entity';

@Entity('farm_reports')
export class FarmImageReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('json')
  // reportData: Record<string, any>;

    
  @Column('text', { nullable: true })
  reportText: string;
  
  @Column('text', { nullable: true })
  summary: string;


  @Column('date')
  reportDate: Date;

  @ManyToOne(() => Farm, farm => farm.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @Column()
  farmId: string;

  @CreateDateColumn()
  createdAt: Date;
}
