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
exports.GetDeviceAdvisoryDto = exports.GetDeviceTasksDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../constants");
class GetDeviceTasksDto {
}
exports.GetDeviceTasksDto = GetDeviceTasksDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: constants_1.TaskStatus,
        required: false,
        description: 'Optional status to filter tasks (e.g., PENDING, COMPLETED)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(constants_1.TaskStatus),
    __metadata("design:type", String)
], GetDeviceTasksDto.prototype, "taskStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetDeviceTasksDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 10,
        description: 'Number of tasks per page',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetDeviceTasksDto.prototype, "limit", void 0);
class GetDeviceAdvisoryDto {
}
exports.GetDeviceAdvisoryDto = GetDeviceAdvisoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetDeviceAdvisoryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 10,
        description: 'Number of tasks per page',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetDeviceAdvisoryDto.prototype, "limit", void 0);
//# sourceMappingURL=get-sensor-based-tasks.dto.js.map