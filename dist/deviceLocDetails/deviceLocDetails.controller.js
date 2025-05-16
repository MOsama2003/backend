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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceLocDetailsController = void 0;
const common_1 = require("@nestjs/common");
const deviceLocDetails_service_1 = require("./deviceLocDetails.service");
const create_deviceLocDetails_dto_1 = require("./dto/create-deviceLocDetails.dto");
const swagger_1 = require("@nestjs/swagger");
let DeviceLocDetailsController = class DeviceLocDetailsController {
    constructor(deviceLocDetailsService) {
        this.deviceLocDetailsService = deviceLocDetailsService;
    }
    async addOrUpdateSensorData(data) {
        return await this.deviceLocDetailsService.createOrUpdate(data);
    }
    async getSensorLocation(req) {
        console.log(req.user, 'sssssssss');
        return this.deviceLocDetailsService.getByDeviceId(req.user.deviceId);
    }
};
exports.DeviceLocDetailsController = DeviceLocDetailsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deviceLocDetails_dto_1.CreateDeviceLocDetails]),
    __metadata("design:returntype", Promise)
], DeviceLocDetailsController.prototype, "addOrUpdateSensorData", null);
__decorate([
    (0, common_1.Get)('latest'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeviceLocDetailsController.prototype, "getSensorLocation", null);
exports.DeviceLocDetailsController = DeviceLocDetailsController = __decorate([
    (0, common_1.Controller)('sensor-location-data'),
    __metadata("design:paramtypes", [deviceLocDetails_service_1.DeviceLocDetailsService])
], DeviceLocDetailsController);
//# sourceMappingURL=deviceLocDetails.controller.js.map