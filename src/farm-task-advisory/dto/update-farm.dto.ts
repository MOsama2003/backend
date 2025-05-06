// dto/update-farm.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEnum, 
  IsBoolean, 
  IsDateString, 
  IsString, 
  IsNumber, 
  IsArray, 
  Min, 
  IsOptional 
} from 'class-validator';
import { 
  SoilType, 
  WaterSource, 
  GrowthStage, 
  IrrigationType, 
  WaterAvailability,
  FertilizerType, 
} from 'src/constants';

export class UpdateFarmDto {
  @ApiProperty({ description: 'Name of Farm', example: 'Gray Rice North', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Total land area in acres', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  totalLandArea?: number;

  @ApiProperty({ description: 'Farm location as a Google Maps API location name', example: 'Karachi, Pakistan', required: false })
  @IsOptional()
  @IsString()
  farmLocation?: string;

  @ApiProperty({ description: 'Latitude of the farm', example: 24.8607, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ description: 'Longitude of the farm', example: 67.0011, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ enum: SoilType, description: 'Type of soil on the farm', example: SoilType.LOAMY, required: false })
  @IsOptional()
  @IsEnum(SoilType)
  soilType?: SoilType;

  @ApiProperty({ enum: WaterSource, description: 'Primary water source for the farm', example: WaterSource.RIVER, required: false })
  @IsOptional()
  @IsEnum(WaterSource)
  waterSource?: WaterSource;

  @ApiProperty({ description: 'Name of crop being cultivated', example: 'Wheat', required: false })
  @IsOptional()
  @IsString()
  crop?: string;

  @ApiProperty({ description: 'Date of sowing in YYYY-MM-DD format', example: '2024-09-01', required: false })
  @IsOptional()
  @IsDateString()
  sowingDate?: string;

  @ApiProperty({ enum: GrowthStage, description: 'Current growth stage of the crop', example: GrowthStage.GERMINATION, required: false })
  @IsOptional()
  @IsEnum(GrowthStage)
  currentGrowthStage?: GrowthStage;

  @ApiProperty({ description: 'Indicates whether past pest issues have occurred', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  pastPestIssues?: boolean;

  @ApiProperty({ enum: IrrigationType, description: 'Type of irrigation system used', example: IrrigationType.DRIP, required: false })
  @IsOptional()
  @IsEnum(IrrigationType)
  irrigationType?: IrrigationType;

  @ApiProperty({ enum: WaterAvailability, description: 'Current water availability status', example: WaterAvailability.SUFFICIENT, required: false })
  @IsOptional()
  @IsEnum(WaterAvailability)
  waterAvailabilityStatus?: WaterAvailability;

  @ApiProperty({ 
    enum: FertilizerType, 
    type: [String],
    description: 'List of fertilizers used on the farm', 
    example: [FertilizerType.NPK, FertilizerType.ORGANIC],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsEnum(FertilizerType, { each: true })
  fertilizersUsed?: FertilizerType[];
}