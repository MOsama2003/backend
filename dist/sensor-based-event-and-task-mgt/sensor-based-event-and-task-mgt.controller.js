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
exports.SensorBasedEventAndTaskMgtController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_sensor_based_event_and_task_mgt_dto_1 = require("./dto/create-sensor-based-event-and-task-mgt.dto");
const update_task_status_dto_1 = require("./dto/update-task-status.dto");
const sensor_based_event_and_task_mgt_service_1 = require("./sensor-based-event-and-task-mgt.service");
const get_sensor_based_tasks_dto_1 = require("./dto/get-sensor-based-tasks.dto");
let SensorBasedEventAndTaskMgtController = class SensorBasedEventAndTaskMgtController {
    constructor(sensorBasedEventAndTaskMgtService) {
        this.sensorBasedEventAndTaskMgtService = sensorBasedEventAndTaskMgtService;
    }
    async createFarm(createFarmDto, req) {
        return this.sensorBasedEventAndTaskMgtService.create({
            ...createFarmDto,
            deviceId: req.user.deviceId,
        });
    }
    async getAdvisory(deviceId, req) {
        return this.sensorBasedEventAndTaskMgtService.addAdvisories(deviceId, req);
    }
    async updateFarmDetails(updateFarmDto, req) {
        return this.sensorBasedEventAndTaskMgtService.update(req.user.deviceId, updateFarmDto);
    }
    async getFarmDetails(req) {
        return this.sensorBasedEventAndTaskMgtService.getFormByDeviceId(req.user.deviceId);
    }
    async getTask(deviceId, req) {
        return this.sensorBasedEventAndTaskMgtService.addTasks(deviceId, req);
    }
    async updateTasks(deviceId, req) {
        return this.sensorBasedEventAndTaskMgtService.updateTasks(deviceId, req);
    }
    async generateReport(deviceId, req) {
        return this.sensorBasedEventAndTaskMgtService.weeklyReport(deviceId, req);
    }
    async updateTaskStatus(id, body) {
        const { taskStatus } = body;
        return this.sensorBasedEventAndTaskMgtService.updateTaskStatus({
            id,
            taskStatus,
        });
    }
    async taskListing(req, query) {
        return this.sensorBasedEventAndTaskMgtService.getTasks(req.user.deviceId, query);
    }
    async advisoryListing(req, query) {
        return this.sensorBasedEventAndTaskMgtService.getAdvisories(req.user.deviceId, query);
    }
    async reportListing(req, query) {
        return this.sensorBasedEventAndTaskMgtService.getWeeklyReport(req.user.deviceId, query);
    }
    async dashboard(req) {
        return this.sensorBasedEventAndTaskMgtService.dashboard(req.user.deviceId);
    }
    async getTaskStatusCounts(req) {
        return this.sensorBasedEventAndTaskMgtService.getTaskStatusCounts(req.user.deviceId);
    }
};
exports.SensorBasedEventAndTaskMgtController = SensorBasedEventAndTaskMgtController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Farm event/task created successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({ type: create_sensor_based_event_and_task_mgt_dto_1.CreateSensorBasedEventAndTaskMgtDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sensor_based_event_and_task_mgt_dto_1.CreateSensorBasedEventAndTaskMgtDto, Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "createFarm", null);
__decorate([
    (0, common_1.Get)('/advisory/:deviceId'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "getAdvisory", null);
__decorate([
    (0, common_1.Put)('/farm-details'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({ type: create_sensor_based_event_and_task_mgt_dto_1.CreateSensorBasedEventAndTaskMgtDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sensor_based_event_and_task_mgt_dto_1.CreateSensorBasedEventAndTaskMgtDto, Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "updateFarmDetails", null);
__decorate([
    (0, common_1.Get)('/farm-details'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "getFarmDetails", null);
__decorate([
    (0, common_1.Get)('/task/:deviceId'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "getTask", null);
__decorate([
    (0, common_1.Get)('/update-tasks/:deviceId'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "updateTasks", null);
__decorate([
    (0, common_1.Get)('/weekly-report/:deviceId'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "generateReport", null);
__decorate([
    (0, common_1.Patch)('/update-task-status/:taskId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({ name: 'taskId', type: String, description: 'ID of the task' }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_status_dto_1.UpdateTaskStatusDto]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "updateTaskStatus", null);
__decorate([
    (0, common_1.Get)('/task-listing'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_sensor_based_tasks_dto_1.GetDeviceTasksDto]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "taskListing", null);
__decorate([
    (0, common_1.Get)('/advisory-listing'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_sensor_based_tasks_dto_1.GetDeviceAdvisoryDto]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "advisoryListing", null);
__decorate([
    (0, common_1.Get)('/weekly-reports-listing'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_sensor_based_tasks_dto_1.GetDeviceAdvisoryDto]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "reportListing", null);
__decorate([
    (0, common_1.Get)('/dashboard-listing'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('/task-Summary-report'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SensorBasedEventAndTaskMgtController.prototype, "getTaskStatusCounts", null);
exports.SensorBasedEventAndTaskMgtController = SensorBasedEventAndTaskMgtController = __decorate([
    (0, swagger_1.ApiTags)('Sensor-Based Event and Task Management'),
    (0, common_1.Controller)('sensor-based-event-and-task-mgt'),
    __metadata("design:paramtypes", [sensor_based_event_and_task_mgt_service_1.SensorBasedEventAndTaskMgtService])
], SensorBasedEventAndTaskMgtController);
//# sourceMappingURL=sensor-based-event-and-task-mgt.controller.js.map