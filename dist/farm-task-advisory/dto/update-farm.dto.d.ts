import { SoilType, WaterSource, GrowthStage, IrrigationType, WaterAvailability, FertilizerType } from 'src/constants';
export declare class UpdateFarmDto {
    name?: string;
    totalLandArea?: number;
    farmLocation?: string;
    latitude?: number;
    longitude?: number;
    soilType?: SoilType;
    waterSource?: WaterSource;
    crop?: string;
    sowingDate?: string;
    currentGrowthStage?: GrowthStage;
    pastPestIssues?: boolean;
    irrigationType?: IrrigationType;
    waterAvailabilityStatus?: WaterAvailability;
    fertilizersUsed?: FertilizerType[];
}
