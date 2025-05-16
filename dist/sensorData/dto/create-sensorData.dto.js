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
exports.CreateSensorDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSensorDataDto {
}
exports.CreateSensorDataDto = CreateSensorDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Nitrogen level as a float" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateSensorDataDto.prototype, "nitrogen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Potassium level as a float" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateSensorDataDto.prototype, "potassium", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Phosphorus level as a float" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateSensorDataDto.prototype, "phosphorus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Conductivity as a float" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateSensorDataDto.prototype, "conductivity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "pH level as a float" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateSensorDataDto.prototype, "pH", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Humidity as a float" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateSensorDataDto.prototype, "humidity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Temperature as a float" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({ allowNaN: false, maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateSensorDataDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: "Device ID as a string" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSensorDataDto.prototype, "deviceId", void 0);
//# sourceMappingURL=create-sensorData.dto.js.map