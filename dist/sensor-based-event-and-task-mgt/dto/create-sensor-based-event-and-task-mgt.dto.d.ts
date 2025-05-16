import { SoilType, WaterSource, GrowthStage, GrowingConditions, MoistureLevel, IrrigationType, WaterAvailability, FertilizerType } from '../../constants';
export declare class CreateSensorBasedEventAndTaskMgtDto {
    totalLandArea: number;
    farmLocation: string;
    latitude?: number;
    longitude?: number;
    soilType: SoilType;
    waterSource: WaterSource;
    crop: string;
    sowingDate: string;
    currentGrowthStage: GrowthStage;
    idealGrowingConditions: GrowingConditions;
    pastPestIssues: boolean;
    preferredMoistureLevel: MoistureLevel;
    irrigationType: IrrigationType;
    waterAvailabilityStatus: WaterAvailability;
    fertilizersUsed: FertilizerType[];
}
