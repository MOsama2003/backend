export declare const CONSTANTS: {
    ROLE: {
        ADMIN: string;
        FARMER: string;
        COUNSELLAR: string;
    };
    BY_PASS_ROLE: string[];
};
export declare enum PostReaction {
    Upvote = "Upvote",
    Devote = "Devote",
    NoReaction = "NoReaction"
}
export declare enum SoilType {
    SANDY = "Sandy",
    CLAY = "Clay",
    LOAMY = "Loamy",
    PEATY = "Peaty",
    SALINE = "Saline",
    SILT = "Silt"
}
export declare enum WaterSource {
    RIVER = "River",
    GROUNDWATER = "Groundwater",
    RAIN_FED = "Rain-fed",
    DRIP_IRRIGATION = "Drip Irrigation"
}
export declare enum GrowthStage {
    GERMINATION = "Germination",
    VEGETATIVE = "Vegetative",
    FLOWERING = "Flowering",
    HARVESTING = "Harvesting"
}
export declare enum GrowingConditions {
    DRY = "Dry",
    HUMID = "Humid",
    MODERATE = "Moderate"
}
export declare enum MoistureLevel {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High"
}
export declare enum IrrigationType {
    MANUAL = "Manual",
    DRIP = "Drip",
    SPRINKLER = "Sprinkler",
    FLOOD = "Flood"
}
export declare enum WaterAvailability {
    LIMITED = "Limited",
    SUFFICIENT = "Sufficient",
    PLENTY = "Plenty"
}
export declare enum FertilizerType {
    UREA = "Urea",
    DAP = "DAP",
    NPK = "NPK",
    ORGANIC = "Organic",
    NONE = "None"
}
export declare enum TaskStatus {
    TODO = "Todo",
    PENDING = "Pending",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled"
}
export declare enum TaskSeverity {
    HIGH = "HIGH",
    LOW = "LOW",
    MEDIUM = "MEDIUM"
}
export declare enum DeliveryStatus {
    SEEN = "Seen",
    DELIVER = "Deliver",
    SEND = "Send"
}
