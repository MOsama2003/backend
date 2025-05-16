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
exports.SensorBasedEventAndTaskMgtService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sensorData_service_1 = require("../sensorData/sensorData.service");
const typeorm_2 = require("typeorm");
const advisory_generation_service_1 = require("./advisory-generation.service");
const sensor_based_event_and_task_mgt_entity_1 = require("./entities/sensor-based-event-and-task-mgt.entity");
const tasks_generation_service_1 = require("./tasks-generation.service");
const weekly_summary_service_1 = require("./weekly-summary.service");
let SensorBasedEventAndTaskMgtService = class SensorBasedEventAndTaskMgtService {
    constructor(farmRepository, sensorDataService, sensorBasedAdvisoryService, sensorBasedTaskService, sensorBasedWeeklySummaryService) {
        this.farmRepository = farmRepository;
        this.sensorDataService = sensorDataService;
        this.sensorBasedAdvisoryService = sensorBasedAdvisoryService;
        this.sensorBasedTaskService = sensorBasedTaskService;
        this.sensorBasedWeeklySummaryService = sensorBasedWeeklySummaryService;
    }
    async create(createFarmDto) {
        const farm = this.farmRepository.create(createFarmDto);
        return await this.farmRepository.save(farm);
    }
    async getFormByDeviceId(deviceId) {
        if (!deviceId) {
            return [
                {
                    found: false,
                    data: null,
                    deviceId: deviceId ?? '',
                },
            ];
        }
        const farm = await this.farmRepository.findOne({ where: { deviceId } });
        return [
            {
                found: !!farm,
                data: farm || null,
                deviceId,
            },
        ];
    }
    async update(deviceId, updateFarmDto) {
        const farm = await this.farmRepository.findOne({ where: { deviceId } });
        if (!farm) {
            throw new common_1.NotFoundException(`Farm with device ID ${deviceId} not found`);
        }
        const updatedFarm = this.farmRepository.merge(farm, updateFarmDto);
        await this.farmRepository.save(updatedFarm);
        return { message: `Device ${deviceId} updated!` };
    }
    async addAdvisories(deviceId, req) {
        if (!deviceId)
            return;
        const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
        const farmData = await this.farmRepository.findOne({ where: { deviceId } });
        const body = {
            farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
            npk_data: latestNKP
                ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
        };
        const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to send advisories: ${response.statusText}`);
        }
        const res = await response.json();
        const advisories = typeof res.advisories === 'string'
            ? JSON.parse(res.advisories)
            : res.advisories;
        const advArray = advisories?.advisories ?? [];
        if (advArray.length === 0) {
            return {
                status: 200,
                message: 'No advisories to save.',
            };
        }
        return this.sensorBasedAdvisoryService.saveAdvisories(advArray, deviceId, req);
    }
    async addTasks(deviceId, req) {
        if (!deviceId)
            return;
        const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
        const farmData = await this.farmRepository.findOne({ where: { deviceId } });
        const advisories = await this.sensorBasedAdvisoryService.lastTwoEntries(deviceId);
        const body = {
            farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
            npk_data: latestNKP
                ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
            advisories: advisories
                ? advisories.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
        };
        const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/generate-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to send advisories: ${response.statusText}`);
        }
        const res = await response.json();
        const tasks = typeof res.tasks === 'string' ? JSON.parse(res.tasks) : res.tasks;
        if (tasks.length === 0) {
            return {
                status: 200,
                message: 'No tasks to save.',
            };
        }
        return this.sensorBasedTaskService.saveTasks(tasks, deviceId, req);
    }
    async updateTasks(deviceId, req) {
        if (!deviceId)
            return;
        const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
        const farmData = await this.farmRepository.findOne({ where: { deviceId } });
        const advisories = await this.sensorBasedAdvisoryService.lastTwoEntries(deviceId);
        const tasks = await this.sensorBasedTaskService.unCompleteTasks(deviceId);
        const body = {
            farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
            npk_data: latestNKP
                ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
            advisories: advisories
                ? advisories.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
            tasks: tasks
                ? tasks.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
        };
        const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/updated-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to send advisories: ${response.statusText}`);
        }
        const res = await response.json();
        const updatedTask = typeof res.updatedTasks === 'string'
            ? JSON.parse(res.updatedTasks)
            : res.updatedTasks;
        if (updatedTask.length === 0) {
            return {
                status: 200,
                message: 'No tasks to update.',
            };
        }
        return this.sensorBasedTaskService.updateTasks(updatedTask, deviceId, req);
    }
    async weeklyReport(deviceId, req) {
        if (!deviceId)
            return;
        const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
        const farmData = await this.farmRepository.findOne({ where: { deviceId } });
        const advisories = await this.sensorBasedAdvisoryService.getAdvisoryOfWholeWeek(deviceId);
        const tasks = await this.sensorBasedTaskService.getTasksOfWholeWeek(deviceId);
        const body = {
            farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
            npk_data: latestNKP
                ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
            advisories: advisories
                ? advisories.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
            tasks: tasks
                ? tasks.map((entry) => JSON.parse(JSON.stringify(entry)))
                : [],
        };
        const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/generate-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to send advisories: ${response.statusText}`);
        }
        const res = await response.json();
        const parsed = typeof res.weeklySummary === 'string'
            ? JSON.parse(res.weeklySummary)
            : res.weeklySummary;
        const weeklySummaryArray = [parsed];
        if (weeklySummaryArray.length === 0) {
            return {
                status: 200,
                message: 'No weekly summary to save.',
            };
        }
        return this.sensorBasedWeeklySummaryService.saveWeeklySummary(weeklySummaryArray, deviceId, req);
    }
    async updateTaskStatus(data) {
        const { id, taskStatus } = data;
        return this.sensorBasedTaskService.updateStatus({ id, taskStatus });
    }
    async getTasks(deviceId, query) {
        return this.sensorBasedTaskService.getTasks(deviceId, query);
    }
    async getAdvisories(deviceId, query) {
        return this.sensorBasedAdvisoryService.getAdvisories(deviceId, query);
    }
    async getWeeklyReport(deviceId, query) {
        return this.sensorBasedWeeklySummaryService.getWeeklyReport(deviceId, query);
    }
    async dashboard(deviceId) {
        const task = await this.sensorBasedTaskService.lastEntry(deviceId);
        const advisory = await this.sensorBasedAdvisoryService.lastEntry(deviceId);
        const report = await this.sensorBasedWeeklySummaryService.lastEntry(deviceId);
        return {
            ...task,
            ...advisory,
            ...report,
        };
    }
    async getTaskStatusCounts(deviceId) {
        return this.sensorBasedTaskService.getTaskStatusCounts(deviceId);
    }
};
exports.SensorBasedEventAndTaskMgtService = SensorBasedEventAndTaskMgtService;
exports.SensorBasedEventAndTaskMgtService = SensorBasedEventAndTaskMgtService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sensor_based_event_and_task_mgt_entity_1.SensorOnboarding)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sensorData_service_1.SensorDataService,
        advisory_generation_service_1.SensorBasedAdvisoryService,
        tasks_generation_service_1.SensorBasedTaskService,
        weekly_summary_service_1.SensorBasedWeeklySummaryService])
], SensorBasedEventAndTaskMgtService);
//# sourceMappingURL=sensor-based-event-and-task-mgt.service.js.map