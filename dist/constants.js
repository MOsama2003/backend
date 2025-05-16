"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.TaskSeverity = exports.TaskStatus = exports.FertilizerType = exports.WaterAvailability = exports.IrrigationType = exports.MoistureLevel = exports.GrowingConditions = exports.GrowthStage = exports.WaterSource = exports.SoilType = exports.PostReaction = exports.CONSTANTS = void 0;
exports.CONSTANTS = {
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
        '/auth/reset-password'
    ],
};
var PostReaction;
(function (PostReaction) {
    PostReaction["Upvote"] = "Upvote";
    PostReaction["Devote"] = "Devote";
    PostReaction["NoReaction"] = "NoReaction";
})(PostReaction || (exports.PostReaction = PostReaction = {}));
var SoilType;
(function (SoilType) {
    SoilType["SANDY"] = "Sandy";
    SoilType["CLAY"] = "Clay";
    SoilType["LOAMY"] = "Loamy";
    SoilType["PEATY"] = "Peaty";
    SoilType["SALINE"] = "Saline";
    SoilType["SILT"] = "Silt";
})(SoilType || (exports.SoilType = SoilType = {}));
var WaterSource;
(function (WaterSource) {
    WaterSource["RIVER"] = "River";
    WaterSource["GROUNDWATER"] = "Groundwater";
    WaterSource["RAIN_FED"] = "Rain-fed";
    WaterSource["DRIP_IRRIGATION"] = "Drip Irrigation";
})(WaterSource || (exports.WaterSource = WaterSource = {}));
var GrowthStage;
(function (GrowthStage) {
    GrowthStage["GERMINATION"] = "Germination";
    GrowthStage["VEGETATIVE"] = "Vegetative";
    GrowthStage["FLOWERING"] = "Flowering";
    GrowthStage["HARVESTING"] = "Harvesting";
})(GrowthStage || (exports.GrowthStage = GrowthStage = {}));
var GrowingConditions;
(function (GrowingConditions) {
    GrowingConditions["DRY"] = "Dry";
    GrowingConditions["HUMID"] = "Humid";
    GrowingConditions["MODERATE"] = "Moderate";
})(GrowingConditions || (exports.GrowingConditions = GrowingConditions = {}));
var MoistureLevel;
(function (MoistureLevel) {
    MoistureLevel["LOW"] = "Low";
    MoistureLevel["MEDIUM"] = "Medium";
    MoistureLevel["HIGH"] = "High";
})(MoistureLevel || (exports.MoistureLevel = MoistureLevel = {}));
var IrrigationType;
(function (IrrigationType) {
    IrrigationType["MANUAL"] = "Manual";
    IrrigationType["DRIP"] = "Drip";
    IrrigationType["SPRINKLER"] = "Sprinkler";
    IrrigationType["FLOOD"] = "Flood";
})(IrrigationType || (exports.IrrigationType = IrrigationType = {}));
var WaterAvailability;
(function (WaterAvailability) {
    WaterAvailability["LIMITED"] = "Limited";
    WaterAvailability["SUFFICIENT"] = "Sufficient";
    WaterAvailability["PLENTY"] = "Plenty";
})(WaterAvailability || (exports.WaterAvailability = WaterAvailability = {}));
var FertilizerType;
(function (FertilizerType) {
    FertilizerType["UREA"] = "Urea";
    FertilizerType["DAP"] = "DAP";
    FertilizerType["NPK"] = "NPK";
    FertilizerType["ORGANIC"] = "Organic";
    FertilizerType["NONE"] = "None";
})(FertilizerType || (exports.FertilizerType = FertilizerType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "Todo";
    TaskStatus["PENDING"] = "Pending";
    TaskStatus["COMPLETED"] = "Completed";
    TaskStatus["CANCELLED"] = "Cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskSeverity;
(function (TaskSeverity) {
    TaskSeverity["HIGH"] = "HIGH";
    TaskSeverity["LOW"] = "LOW";
    TaskSeverity["MEDIUM"] = "MEDIUM";
})(TaskSeverity || (exports.TaskSeverity = TaskSeverity = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["SEEN"] = "Seen";
    DeliveryStatus["DELIVER"] = "Deliver";
    DeliveryStatus["SEND"] = "Send";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
//# sourceMappingURL=constants.js.map