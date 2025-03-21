
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEnum, IsBoolean, IsDate, IsString, IsNumber } from 'class-validator';
import { FertilizerType, GrowingConditions, GrowthStage, IrrigationType, MoistureLevel, SoilType, WaterAvailability, WaterSource } from 'src/constants';

@Entity()
export class SensorOnboarding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  @IsNumber()
  totalLandArea: number; 

  @Column()
  @IsString()
  farmLocation: string; 

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column()
  @IsString()
  deviceId: string; 
  
  @Column({ type: 'enum', enum: SoilType })
  @IsEnum(SoilType)
  soilType: SoilType;

  @Column({ type: 'enum', enum: WaterSource })
  @IsEnum(WaterSource)
  waterSource: WaterSource;

  @Column()
  @IsString()
  crop: string;

  @Column('date')
  @IsDate()
  sowingDate: Date;

  @Column({ type: 'enum', enum: GrowthStage })
  @IsEnum(GrowthStage)
  currentGrowthStage: GrowthStage;

  @Column({ type: 'enum', enum: GrowingConditions })
  @IsEnum(GrowingConditions)
  idealGrowingConditions: GrowingConditions;

  @Column()
  @IsBoolean()
  pastPestIssues: boolean;

  @Column({ type: 'enum', enum: MoistureLevel })
  @IsEnum(MoistureLevel)
  preferredMoistureLevel: MoistureLevel;

  @Column({ type: 'enum', enum: IrrigationType })
  @IsEnum(IrrigationType)
  irrigationType: IrrigationType;

  @Column({ type: 'enum', enum: WaterAvailability })
  @IsEnum(WaterAvailability)
  waterAvailabilityStatus: WaterAvailability;

  @Column({ type: 'simple-array' })
  fertilizersUsed: FertilizerType[];
}