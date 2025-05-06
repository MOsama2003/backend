// entities/farm.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FarmImage } from './farm-image.entity';
import { FarmImageReport } from './farm-image-report.entity';
import { FarmTask } from './farm-task.entity';
import { FarmAdvisory } from './farm-advisory.entity';
import { 
  SoilType, 
  WaterSource, 
  GrowthStage, 
  IrrigationType, 
  WaterAvailability,
  FertilizerType 
} from 'src/constants';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  displayId: string;

  @Column()
  name: string;

  @Column()
  farmLocation: string;

  @Column('float')
  totalLandArea: number;

  @Column()
  crop: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'enum', enum: SoilType })
  soilType: SoilType;

  @Column({ type: 'enum', enum: WaterSource })
  waterSource: WaterSource;

  @Column({ type: 'date' })
  sowingDate: Date;

  @Column({ type: 'enum', enum: GrowthStage })
  currentGrowthStage: GrowthStage;

  @Column({ type: 'boolean' })
  pastPestIssues: boolean;

  @Column({ type: 'enum', enum: IrrigationType })
  irrigationType: IrrigationType;

  @Column({ type: 'enum', enum: WaterAvailability })
  waterAvailabilityStatus: WaterAvailability;

  @Column({ type: 'enum', enum: FertilizerType, array: true })
  fertilizersUsed: FertilizerType[];


  @Column({ type: 'json', nullable: true })
  additionalDetails: Record<string, any>;

  @Column({ default: false })
  onboardingCompleted: boolean;
  
  @Column({ nullable: true })
  lastUpdateDate: Date;

  @ManyToOne(() => User, user => user.farms)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => FarmImage, image => image.farm, { cascade: true })
  images: FarmImage[];

  @OneToMany(() => FarmImageReport, report => report.farm, { cascade: true })
  reports: FarmImageReport[];

  @OneToMany(() => FarmTask, task => task.farm, { cascade: true })
  tasks: FarmTask[];

  @OneToMany(() => FarmAdvisory, advisory => advisory.farm, { cascade: true })
  advisories: FarmAdvisory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}