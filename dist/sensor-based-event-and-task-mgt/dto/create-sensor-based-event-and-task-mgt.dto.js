"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSensorBasedEventAndTaskMgtDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../constants");
class CreateSensorBasedEventAndTaskMgtDto {
}
exports.CreateSensorBasedEventAndTaskMgtDto = CreateSensorBasedEventAndTaskMgtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total land area in acres or hectares', example: 10 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "totalLandArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Farm location as a Google Maps API location name', example: 'Karachi, Pakistan' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "farmLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude of the farm', example: 24.8607, required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude of the farm', example: 67.0011, required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.SoilType, description: 'Type of soil on the farm', example: constants_1.SoilType.LOAMY }),
    (0, class_validator_1.IsEnum)(constants_1.SoilType),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "soilType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.WaterSource, description: 'Primary water source for the farm', example: constants_1.WaterSource.RIVER }),
    (0, class_validator_1.IsEnum)(constants_1.WaterSource),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "waterSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of crop being cultivated', example: 'Wheat' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "crop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of sowing in YYYY-MM-DD format', example: '2024-09-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "sowingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.GrowthStage, description: 'Current growth stage of the crop', example: constants_1.GrowthStage.GERMINATION }),
    (0, class_validator_1.IsEnum)(constants_1.GrowthStage),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "currentGrowthStage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.GrowingConditions, description: 'Ideal growing conditions for the crop', example: constants_1.GrowingConditions.MODERATE }),
    (0, class_validator_1.IsEnum)(constants_1.GrowingConditions),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "idealGrowingConditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates whether past pest issues have occurred', example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "pastPestIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.MoistureLevel, description: 'Preferred moisture level of the soil', example: constants_1.MoistureLevel.MEDIUM }),
    (0, class_validator_1.IsEnum)(constants_1.MoistureLevel),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "preferredMoistureLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.IrrigationType, description: 'Type of irrigation system used', example: constants_1.IrrigationType.DRIP }),
    (0, class_validator_1.IsEnum)(constants_1.IrrigationType),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "irrigationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.WaterAvailability, description: 'Current water availability status', example: constants_1.WaterAvailability.SUFFICIENT }),
    (0, class_validator_1.IsEnum)(constants_1.WaterAvailability),
    __metadata("design:type", String)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "waterAvailabilityStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: constants_1.FertilizerType,
        isArray: true,
        description: 'List of fertilizers used on the farm',
        example: [constants_1.FertilizerType.NPK, constants_1.FertilizerType.ORGANIC]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(constants_1.FertilizerType, { each: true }),
    __metadata("design:type", Array)
], CreateSensorBasedEventAndTaskMgtDto.prototype, "fertilizersUsed", void 0);
//# sourceMappingURL=create-sensor-based-event-and-task-mgt.dto.js.map