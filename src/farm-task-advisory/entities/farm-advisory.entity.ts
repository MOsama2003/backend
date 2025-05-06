
// entities/farm-advisory.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Farm } from './farm.entity';

@Entity('farm_advisories') 
export class FarmAdvisory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json')
  advisoryData: Record<string, any>;

  @Column('date')
  advisoryDate: Date;

  @ManyToOne(() => Farm, farm => farm.advisories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @Column()
  farmId: string;

  @CreateDateColumn()
  createdAt: Date;
}