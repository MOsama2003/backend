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
var SensorEventHandlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorEventHandlerService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const sensor_data_event_1 = require("./sensor-data.event");
const sensor_based_event_and_task_mgt_service_1 = require("../sensor-based-event-and-task-mgt/sensor-based-event-and-task-mgt.service");
let SensorEventHandlerService = SensorEventHandlerService_1 = class SensorEventHandlerService {
    constructor(sensorTaskService) {
        this.sensorTaskService = sensorTaskService;
        this.logger = new common_1.Logger(SensorEventHandlerService_1.name);
    }
    async handleSensorData(event) {
        this.logger.log(`Processing advisory for device: ${event.deviceId}`);
        await this.sensorTaskService.addAdvisories(event.deviceId, event.req);
        this.logger.log(`✅ Advisory generated for ${event.deviceId}, triggering task creation...`);
        this.sensorTaskService.addTasks(event.deviceId, event.req);
        this.logger.log(`✅ Tasks generated for ${event.deviceId}, triggering task creation...`);
        this.sensorTaskService.updateTasks(event.deviceId, event.req);
        this.logger.log(`✅ Task update generated for ${event.deviceId}, triggering task creation...`);
    }
};
exports.SensorEventHandlerService = SensorEventHandlerService;
__decorate([
    (0, event_emitter_1.OnEvent)('sensor.data.process'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sensor_data_event_1.SensorDataEvent]),
    __metadata("design:returntype", Promise)
], SensorEventHandlerService.prototype, "handleSensorData", null);
exports.SensorEventHandlerService = SensorEventHandlerService = SensorEventHandlerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sensor_based_event_and_task_mgt_service_1.SensorBasedEventAndTaskMgtService])
], SensorEventHandlerService);
//# sourceMappingURL=sensor-event-handler.service.js.map