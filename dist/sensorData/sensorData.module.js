"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorDataModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sensorData_entity_1 = require("./entities/sensorData.entity");
const sensorData_service_1 = require("./sensorData.service");
const user_module_1 = require("../user/user.module");
const sensorData_controller_1 = require("./sensorData.controller");
const event_emitter_1 = require("@nestjs/event-emitter");
const sensor_event_handler_service_1 = require("./sensor-event-handler.service");
const sensor_based_event_and_task_mgt_module_1 = require("../sensor-based-event-and-task-mgt/sensor-based-event-and-task-mgt.module");
const notifications_module_1 = require("../notifications/notifications.module");
let SensorDataModule = class SensorDataModule {
};
exports.SensorDataModule = SensorDataModule;
exports.SensorDataModule = SensorDataModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([sensorData_entity_1.SensorData]), user_module_1.UserModule, (0, common_1.forwardRef)(() => sensor_based_event_and_task_mgt_module_1.SensorBasedEventAndTaskMgtModule), event_emitter_1.EventEmitterModule.forRoot(), notifications_module_1.NotificationsModule],
        controllers: [sensorData_controller_1.SensorDataController],
        providers: [sensorData_service_1.SensorDataService, sensor_event_handler_service_1.SensorEventHandlerService],
        exports: [sensorData_service_1.SensorDataService]
    })
], SensorDataModule);
//# sourceMappingURL=sensorData.module.js.map