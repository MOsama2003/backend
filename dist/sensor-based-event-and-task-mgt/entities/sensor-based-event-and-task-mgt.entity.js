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
exports.SensorOnboarding = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../constants");
let SensorOnboarding = class SensorOnboarding {
};
exports.SensorOnboarding = SensorOnboarding;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SensorOnboarding.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SensorOnboarding.prototype, "totalLandArea", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "farmLocation", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], SensorOnboarding.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], SensorOnboarding.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.SoilType }),
    (0, class_validator_1.IsEnum)(constants_1.SoilType),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "soilType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.WaterSource }),
    (0, class_validator_1.IsEnum)(constants_1.WaterSource),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "waterSource", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "crop", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SensorOnboarding.prototype, "sowingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.GrowthStage }),
    (0, class_validator_1.IsEnum)(constants_1.GrowthStage),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "currentGrowthStage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.GrowingConditions }),
    (0, class_validator_1.IsEnum)(constants_1.GrowingConditions),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "idealGrowingConditions", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SensorOnboarding.prototype, "pastPestIssues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.MoistureLevel }),
    (0, class_validator_1.IsEnum)(constants_1.MoistureLevel),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "preferredMoistureLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.IrrigationType }),
    (0, class_validator_1.IsEnum)(constants_1.IrrigationType),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "irrigationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.WaterAvailability }),
    (0, class_validator_1.IsEnum)(constants_1.WaterAvailability),
    __metadata("design:type", String)
], SensorOnboarding.prototype, "waterAvailabilityStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array' }),
    __metadata("design:type", Array)
], SensorOnboarding.prototype, "fertilizersUsed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SensorOnboarding.prototype, "createdAt", void 0);
exports.SensorOnboarding = SensorOnboarding = __decorate([
    (0, typeorm_1.Entity)()
], SensorOnboarding);
//# sourceMappingURL=sensor-based-event-and-task-mgt.entity.js.map