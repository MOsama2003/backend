"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorBasedEventAndTaskMgtModule = void 0;
const common_1 = require("@nestjs/common");
const sensor_based_event_and_task_mgt_service_1 = require("./sensor-based-event-and-task-mgt.service");
const sensor_based_event_and_task_mgt_controller_1 = require("./sensor-based-event-and-task-mgt.controller");
const typeorm_1 = require("@nestjs/typeorm");
const sensor_based_event_and_task_mgt_entity_1 = require("./entities/sensor-based-event-and-task-mgt.entity");
const sensorData_module_1 = require("../sensorData/sensorData.module");
const advisory_generation_service_1 = require("./advisory-generation.service");
const advisory_entity_1 = require("./entities/advisory.entity");
const tasks_generation_service_1 = require("./tasks-generation.service");
const task_entity_1 = require("./entities/task.entity");
const weekly_summary_service_1 = require("./weekly-summary.service");
const week_summary_entity_1 = require("./entities/week-summary.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let SensorBasedEventAndTaskMgtModule = class SensorBasedEventAndTaskMgtModule {
};
exports.SensorBasedEventAndTaskMgtModule = SensorBasedEventAndTaskMgtModule;
exports.SensorBasedEventAndTaskMgtModule = SensorBasedEventAndTaskMgtModule = __decorate([
    (0, common_1.Module)({
        controllers: [sensor_based_event_and_task_mgt_controller_1.SensorBasedEventAndTaskMgtController],
        providers: [sensor_based_event_and_task_mgt_service_1.SensorBasedEventAndTaskMgtService, advisory_generation_service_1.SensorBasedAdvisoryService, tasks_generation_service_1.SensorBasedTaskService, weekly_summary_service_1.SensorBasedWeeklySummaryService],
        imports: [typeorm_1.TypeOrmModule.forFeature([sensor_based_event_and_task_mgt_entity_1.SensorOnboarding, advisory_entity_1.DeviceAdvisory, task_entity_1.DeviceTasks, week_summary_entity_1.WeeklyFarmReport]), (0, common_1.forwardRef)(() => sensorData_module_1.SensorDataModule), notifications_module_1.NotificationsModule],
        exports: [sensor_based_event_and_task_mgt_service_1.SensorBasedEventAndTaskMgtService]
    })
], SensorBasedEventAndTaskMgtModule);
//# sourceMappingURL=sensor-based-event-and-task-mgt.module.js.map