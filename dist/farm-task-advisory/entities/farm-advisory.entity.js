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
exports.FarmAdvisory = void 0;
const typeorm_1 = require("typeorm");
const farm_entity_1 = require("./farm.entity");
let FarmAdvisory = class FarmAdvisory {
};
exports.FarmAdvisory = FarmAdvisory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FarmAdvisory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Object)
], FarmAdvisory.prototype, "advisoryData", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], FarmAdvisory.prototype, "advisoryDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farm_entity_1.Farm, farm => farm.advisories, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'farmId' }),
    __metadata("design:type", farm_entity_1.Farm)
], FarmAdvisory.prototype, "farm", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmAdvisory.prototype, "farmId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FarmAdvisory.prototype, "createdAt", void 0);
exports.FarmAdvisory = FarmAdvisory = __decorate([
    (0, typeorm_1.Entity)('farm_advisories')
], FarmAdvisory);
//# sourceMappingURL=farm-advisory.entity.js.map