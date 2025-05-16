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
exports.Farm = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const farm_image_entity_1 = require("./farm-image.entity");
const farm_image_report_entity_1 = require("./farm-image-report.entity");
const farm_task_entity_1 = require("./farm-task.entity");
const farm_advisory_entity_1 = require("./farm-advisory.entity");
const constants_1 = require("../../constants");
let Farm = class Farm {
};
exports.Farm = Farm;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Farm.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Farm.prototype, "displayId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Farm.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Farm.prototype, "farmLocation", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], Farm.prototype, "totalLandArea", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Farm.prototype, "crop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Farm.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Farm.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.SoilType }),
    __metadata("design:type", String)
], Farm.prototype, "soilType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.WaterSource }),
    __metadata("design:type", String)
], Farm.prototype, "waterSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Farm.prototype, "sowingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.GrowthStage }),
    __metadata("design:type", String)
], Farm.prototype, "currentGrowthStage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], Farm.prototype, "pastPestIssues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.IrrigationType }),
    __metadata("design:type", String)
], Farm.prototype, "irrigationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.WaterAvailability }),
    __metadata("design:type", String)
], Farm.prototype, "waterAvailabilityStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.FertilizerType, array: true }),
    __metadata("design:type", Array)
], Farm.prototype, "fertilizersUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Farm.prototype, "additionalDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Farm.prototype, "onboardingCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Farm.prototype, "lastUpdateDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.farms),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Farm.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Farm.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => farm_image_entity_1.FarmImage, image => image.farm, { cascade: true }),
    __metadata("design:type", Array)
], Farm.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => farm_image_report_entity_1.FarmImageReport, report => report.farm, { cascade: true }),
    __metadata("design:type", Array)
], Farm.prototype, "reports", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => farm_task_entity_1.FarmTask, task => task.farm, { cascade: true }),
    __metadata("design:type", Array)
], Farm.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => farm_advisory_entity_1.FarmAdvisory, advisory => advisory.farm, { cascade: true }),
    __metadata("design:type", Array)
], Farm.prototype, "advisories", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Farm.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Farm.prototype, "updatedAt", void 0);
exports.Farm = Farm = __decorate([
    (0, typeorm_1.Entity)('farms')
], Farm);
//# sourceMappingURL=farm.entity.js.map