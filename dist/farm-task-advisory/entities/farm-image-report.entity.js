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
exports.FarmImageReport = void 0;
const typeorm_1 = require("typeorm");
const farm_entity_1 = require("./farm.entity");
let FarmImageReport = class FarmImageReport {
};
exports.FarmImageReport = FarmImageReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FarmImageReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], FarmImageReport.prototype, "reportText", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], FarmImageReport.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], FarmImageReport.prototype, "reportDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farm_entity_1.Farm, farm => farm.reports, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'farmId' }),
    __metadata("design:type", farm_entity_1.Farm)
], FarmImageReport.prototype, "farm", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmImageReport.prototype, "farmId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FarmImageReport.prototype, "createdAt", void 0);
exports.FarmImageReport = FarmImageReport = __decorate([
    (0, typeorm_1.Entity)('farm_reports')
], FarmImageReport);
//# sourceMappingURL=farm-image-report.entity.js.map