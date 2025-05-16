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
exports.RequestedCounsellar = void 0;
const class_validator_1 = require("class-validator");
const appointment_entity_1 = require("../../appointment/entities/appointment.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let RequestedCounsellar = class RequestedCounsellar {
};
exports.RequestedCounsellar = RequestedCounsellar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RequestedCounsellar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "resume", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "yoe", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "expertise", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true, default: '1,2,3,4,5' }),
    __metadata("design:type", Array)
], RequestedCounsellar.prototype, "workingDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: '09:00' }),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: '17:00' }),
    __metadata("design:type", String)
], RequestedCounsellar.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], RequestedCounsellar.prototype, "isApproved", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], RequestedCounsellar.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => appointment_entity_1.Appointment, (appointment) => appointment.counselor),
    __metadata("design:type", Array)
], RequestedCounsellar.prototype, "appointments", void 0);
exports.RequestedCounsellar = RequestedCounsellar = __decorate([
    (0, typeorm_1.Entity)()
], RequestedCounsellar);
//# sourceMappingURL=requested-counsellar.entity.js.map