import { FertilizerType, GrowingConditions, GrowthStage, IrrigationType, MoistureLevel, SoilType, WaterAvailability, WaterSource } from 'src/constants';
export declare class SensorOnboarding {
    id: number;
    totalLandArea: number;
    farmLocation: string;
    latitude: number;
    longitude: number;
    deviceId: string;
    soilType: SoilType;
    waterSource: WaterSource;
    crop: string;
    sowingDate: Date;
    currentGrowthStage: GrowthStage;
    idealGrowingConditions: GrowingConditions;
    pastPestIssues: boolean;
    preferredMoistureLevel: MoistureLevel;
    irrigationType: IrrigationType;
    waterAvailabilityStatus: WaterAvailability;
    fertilizersUsed: FertilizerType[];
    createdAt: Date;
}
