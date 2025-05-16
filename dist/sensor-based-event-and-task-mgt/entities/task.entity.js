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
exports.DeviceTasks = void 0;
const class_validator_1 = require("class-validator");
const constants_1 = require("../../constants");
const typeorm_1 = require("typeorm");
let DeviceTasks = class DeviceTasks {
};
exports.DeviceTasks = DeviceTasks;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeviceTasks.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceTasks.prototype, "taskTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceTasks.prototype, "taskDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.TaskSeverity, nullable: true }),
    (0, class_validator_1.IsEnum)(constants_1.TaskSeverity),
    __metadata("design:type", String)
], DeviceTasks.prototype, "taskSeverity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.TaskStatus, nullable: true }),
    (0, class_validator_1.IsEnum)(constants_1.TaskStatus),
    __metadata("design:type", String)
], DeviceTasks.prototype, "taskStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], DeviceTasks.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], DeviceTasks.prototype, "deadliestDeadline", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DeviceTasks.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", Date)
], DeviceTasks.prototype, "createdAt", void 0);
exports.DeviceTasks = DeviceTasks = __decorate([
    (0, typeorm_1.Entity)()
], DeviceTasks);
//# sourceMappingURL=task.entity.js.map