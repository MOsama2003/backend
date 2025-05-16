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
exports.CreateFarmDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../constants");
class CreateFarmDto {
}
exports.CreateFarmDto = CreateFarmDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of Farm', example: 'Gray Rice North' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total land area in acres', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    __metadata("design:type", Number)
], CreateFarmDto.prototype, "totalLandArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Farm location as a Google Maps API location name', example: 'Karachi, Pakistan' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "farmLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude of the farm', example: 31.427, required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFarmDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude of the farm', example: 73.1166, required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateFarmDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.SoilType, description: 'Type of soil on the farm', example: constants_1.SoilType.CLAY }),
    (0, class_validator_1.IsEnum)(constants_1.SoilType),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "soilType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.WaterSource, description: 'Primary water source for the farm', example: constants_1.WaterSource.RIVER }),
    (0, class_validator_1.IsEnum)(constants_1.WaterSource),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "waterSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of crop being cultivated', example: 'Wheat' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "crop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of sowing in YYYY-MM-DD format', example: '2025-03-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "sowingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.GrowthStage, description: 'Current growth stage of the crop', example: constants_1.GrowthStage.VEGETATIVE }),
    (0, class_validator_1.IsEnum)(constants_1.GrowthStage),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "currentGrowthStage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indicates whether past pest issues have occurred', example: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFarmDto.prototype, "pastPestIssues", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.IrrigationType, description: 'Type of irrigation system used', example: constants_1.IrrigationType.DRIP }),
    (0, class_validator_1.IsEnum)(constants_1.IrrigationType),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "irrigationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: constants_1.WaterAvailability, description: 'Current water availability status', example: constants_1.WaterAvailability.SUFFICIENT }),
    (0, class_validator_1.IsEnum)(constants_1.WaterAvailability),
    __metadata("design:type", String)
], CreateFarmDto.prototype, "waterAvailabilityStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        enum: constants_1.FertilizerType,
        description: 'List of fertilizers used on the farm',
        example: [constants_1.FertilizerType.NPK, constants_1.FertilizerType.ORGANIC]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(constants_1.FertilizerType, { each: true }),
    __metadata("design:type", Array)
], CreateFarmDto.prototype, "fertilizersUsed", void 0);
//# sourceMappingURL=create-farm.dto.js.map