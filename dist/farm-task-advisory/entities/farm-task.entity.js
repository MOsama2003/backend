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
exports.FarmTask = exports.TaskStatus = void 0;
const typeorm_1 = require("typeorm");
const farm_entity_1 = require("./farm.entity");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["NOT_STARTED"] = "Not Started";
    TaskStatus["IN_PROGRESS"] = "In Progress";
    TaskStatus["COMPLETED"] = "Completed";
    TaskStatus["CANCELLED"] = "Cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
let FarmTask = class FarmTask {
};
exports.FarmTask = FarmTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FarmTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmTask.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmTask.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmTask.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], FarmTask.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.NOT_STARTED,
    }),
    __metadata("design:type", String)
], FarmTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], FarmTask.prototype, "context", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], FarmTask.prototype, "taskDescription", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Array)
], FarmTask.prototype, "steps", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], FarmTask.prototype, "supportingInformation", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], FarmTask.prototype, "followUp", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Array)
], FarmTask.prototype, "dependencies", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farm_entity_1.Farm, farm => farm.tasks, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'farmId' }),
    __metadata("design:type", farm_entity_1.Farm)
], FarmTask.prototype, "farm", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FarmTask.prototype, "farmId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FarmTask.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FarmTask.prototype, "updatedAt", void 0);
exports.FarmTask = FarmTask = __decorate([
    (0, typeorm_1.Entity)('farm_tasks')
], FarmTask);
//# sourceMappingURL=farm-task.entity.js.map