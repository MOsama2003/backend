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
exports.UpdateFarmDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../constants");
class UpdateFarmDto {
}
exports.UpdateFarmDto = UpdateFarmDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of Farm', example: 'Gray Rice North', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total land area in acres', example: 10, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    __metadata("design:type", Number)
], UpdateFarmDto.prototype, "totalLandArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Farm location as a Google Maps API location name', example: 'Karachi, Pakistan', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "farmLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude of the farm', example: 24.8607, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateFarmDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude of the farm', example: 67.0011, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateFarmDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.SoilType, description: 'Type of soil on the farm', example: constants_1.SoilType.LOAMY, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.SoilType),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "soilType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.WaterSource, description: 'Primary water source for the farm', example: constants_1.WaterSource.RIVER, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.WaterSource),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "waterSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of crop being cultivated', example: 'Wheat', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "crop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of sowing in YYYY-MM-DD format', example: '2024-09-01', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "sowingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.GrowthStage, description: 'Current growth stage of the crop', example: constants_1.GrowthStage.GERMINATION, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.GrowthStage),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "currentGrowthStage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates whether past pest issues have occurred', example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFarmDto.prototype, "pastPestIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.IrrigationType, description: 'Type of irrigation system used', example: constants_1.IrrigationType.DRIP, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.IrrigationType),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "irrigationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.WaterAvailability, description: 'Current water availability status', example: constants_1.WaterAvailability.SUFFICIENT, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.WaterAvailability),
    __metadata("design:type", String)
], UpdateFarmDto.prototype, "waterAvailabilityStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: constants_1.FertilizerType,
        type: [String],
        description: 'List of fertilizers used on the farm',
        example: [constants_1.FertilizerType.NPK, constants_1.FertilizerType.ORGANIC],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(constants_1.FertilizerType, { each: true }),
    __metadata("design:type", Array)
], UpdateFarmDto.prototype, "fertilizersUsed", void 0);
//# sourceMappingURL=update-farm.dto.js.map