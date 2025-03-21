import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsDateString, IsString, IsNumber, IsArray } from 'class-validator';
import { 
  SoilType, 
  WaterSource, 
  GrowthStage, 
  GrowingConditions, 
  MoistureLevel, 
  IrrigationType, 
  WaterAvailability, 
  FertilizerType 
} from '../../constants';

export class CreateSensorBasedEventAndTaskMgtDto {
  
  @ApiProperty({ description: 'Total land area in acres or hectares', example: 10 })
  @IsNumber()
  totalLandArea: number; 

  @ApiProperty({ description: 'Farm location as a Google Maps API location name', example: 'Karachi, Pakistan' })
  @IsString()
  farmLocation: string; 

  @ApiProperty({ description: 'Latitude of the farm', example: 24.8607, required: false })
  @IsNumber()
  latitude?: number;

  @ApiProperty({ description: 'Longitude of the farm', example: 67.0011, required: false })
  @IsNumber()
  longitude?: number;

  @ApiProperty({ enum: SoilType, description: 'Type of soil on the farm', example: SoilType.LOAMY })
  @IsEnum(SoilType)
  soilType: SoilType;

  @ApiProperty({ enum: WaterSource, description: 'Primary water source for the farm', example: WaterSource.RIVER })
  @IsEnum(WaterSource)
  waterSource: WaterSource;

  @ApiProperty({ description: 'Type of crop being cultivated', example: 'Wheat' })
  @IsString()
  crop: string;

  @ApiProperty({ description: 'Date of sowing in YYYY-MM-DD format', example: '2024-09-01' })
  @IsDateString()
  sowingDate: string;

  @ApiProperty({ enum: GrowthStage, description: 'Current growth stage of the crop', example: GrowthStage.GERMINATION })
  @IsEnum(GrowthStage)
  currentGrowthStage: GrowthStage;

  @ApiProperty({ enum: GrowingConditions, description: 'Ideal growing conditions for the crop', example: GrowingConditions.MODERATE })
  @IsEnum(GrowingConditions)
  idealGrowingConditions: GrowingConditions;

  @ApiProperty({ description: 'Indicates whether past pest issues have occurred', example: true })
  @IsBoolean()
  pastPestIssues: boolean;

  @ApiProperty({ enum: MoistureLevel, description: 'Preferred moisture level of the soil', example: MoistureLevel.MEDIUM })
  @IsEnum(MoistureLevel)
  preferredMoistureLevel: MoistureLevel;

  @ApiProperty({ enum: IrrigationType, description: 'Type of irrigation system used', example: IrrigationType.DRIP })
  @IsEnum(IrrigationType)
  irrigationType: IrrigationType;

  @ApiProperty({ enum: WaterAvailability, description: 'Current water availability status', example: WaterAvailability.SUFFICIENT })
  @IsEnum(WaterAvailability)
  waterAvailabilityStatus: WaterAvailability;

  @ApiProperty({ 
    enum: FertilizerType, 
    isArray: true, 
    description: 'List of fertilizers used on the farm', 
    example: [FertilizerType.NPK, FertilizerType.ORGANIC] 
  })
  @IsArray()
  @IsEnum(FertilizerType, { each: true })
  fertilizersUsed: FertilizerType[];
}
