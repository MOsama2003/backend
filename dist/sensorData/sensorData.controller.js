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
exports.SensorDataController = void 0;
const common_1 = require("@nestjs/common");
const sensorData_service_1 = require("./sensorData.service");
const create_sensorData_dto_1 = require("./dto/create-sensorData.dto");
const swagger_1 = require("@nestjs/swagger");
const Pagination_data_dto_1 = require("./dto/Pagination-data.dto");
const event_emitter_1 = require("@nestjs/event-emitter");
const sensor_data_event_1 = require("./sensor-data.event");
let SensorDataController = class SensorDataController {
    constructor(sensorDataService, eventEmitter) {
        this.sensorDataService = sensorDataService;
        this.eventEmitter = eventEmitter;
    }
    async addSensorData(data, req) {
        const sensorData = await this.sensorDataService.create(data);
        this.eventEmitter.emit('sensor.data.process', new sensor_data_event_1.SensorDataEvent(data.deviceId, req));
        return sensorData;
    }
    async findAll(paginationQuery, req) {
        return this.sensorDataService.dataListing(paginationQuery, req);
    }
    async findLast(req) {
        return this.sensorDataService.lastEntry(req.user.deviceId);
    }
};
exports.SensorDataController = SensorDataController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sensorData_dto_1.CreateSensorDataDto, Object]),
    __metadata("design:returntype", Promise)
], SensorDataController.prototype, "addSensorData", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of sensor data' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_data_dto_1.PaginationQueryDto, Object]),
    __metadata("design:returntype", Promise)
], SensorDataController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('latest'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SensorDataController.prototype, "findLast", null);
exports.SensorDataController = SensorDataController = __decorate([
    (0, common_1.Controller)('sensor-data'),
    __metadata("design:paramtypes", [sensorData_service_1.SensorDataService,
        event_emitter_1.EventEmitter2])
], SensorDataController);
//# sourceMappingURL=sensorData.controller.js.map