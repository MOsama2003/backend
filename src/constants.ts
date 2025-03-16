export const CONSTANTS = {
  ROLE: {
    ADMIN: 'admin',
    FARMER: 'farmer',
    COUNSELLAR: 'counsellar',
  },
  BY_PASS_ROLE: [
    '/auth/login',
    '/sensor-data',
    '/sensor-location-data',
    '/requested-counsellar',
    '/user/register-non-device-owner',
    '/auth/forgot-password',
    '/auth/verify-otp',
    '/auth/reset-password',
  ],
};

export enum PostReaction {
  Upvote = 'Upvote',
  Devote = 'Devote',
  NoReaction = 'NoReaction',
}

export enum SoilType {
  SANDY = 'Sandy',
  CLAY = 'Clay',
  LOAMY = 'Loamy',
  PEATY = 'Peaty',
  SALINE = 'Saline',
  SILT = 'Silt',
}

export enum WaterSource {
  RIVER = 'River',
  GROUNDWATER = 'Groundwater',
  RAIN_FED = 'Rain-fed',
  DRIP_IRRIGATION = 'Drip Irrigation',
}

export enum GrowthStage {
  GERMINATION = 'Germination',
  VEGETATIVE = 'Vegetative',
  FLOWERING = 'Flowering',
  HARVESTING = 'Harvesting',
}

export enum GrowingConditions {
  DRY = 'Dry',
  HUMID = 'Humid',
  MODERATE = 'Moderate',
}

export enum MoistureLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum IrrigationType {
  MANUAL = 'Manual',
  DRIP = 'Drip',
  SPRINKLER = 'Sprinkler',
  FLOOD = 'Flood',
}

export enum WaterAvailability {
  LIMITED = 'Limited',
  SUFFICIENT = 'Sufficient',
  PLENTY = 'Plenty',
}

export enum FertilizerType {
  UREA = 'Urea',
  DAP = 'DAP',
  NPK = 'NPK',
  ORGANIC = 'Organic',
  NONE = 'None',
}
