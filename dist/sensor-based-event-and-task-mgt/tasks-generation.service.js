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
exports.SensorBasedTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const constants_1 = require("../constants");
const firebase_service_1 = require("../notifications/firebase.service");
let SensorBasedTaskService = class SensorBasedTaskService {
    constructor(taskRepository, notificationService) {
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
    }
    async saveTasks(tasks, deviceId, req) {
        const taskEntities = tasks.map((task) => ({
            ...task,
            taskStatus: constants_1.TaskStatus.TODO,
            deviceId,
            createdAt: new Date(),
        }));
        if (req?.user?.id) {
            await this.notificationService.sendNotification({
                title: 'New Tasks added',
                body: 'check Tasks for today',
                data: { deviceId: deviceId },
            }, +req.user.id);
        }
        return this.taskRepository.save(taskEntities);
    }
    async lastTwoEntries(deviceId) {
        const lastTwoEntries = await this.taskRepository.find({
            where: { deviceId },
            order: { id: 'DESC' },
            take: 2,
        });
        return lastTwoEntries;
    }
    async unCompleteTasks(deviceId) {
        const tasks = await this.taskRepository.find({
            where: {
                deviceId,
                taskStatus: (0, typeorm_2.In)([constants_1.TaskStatus.PENDING, constants_1.TaskStatus.TODO]),
            },
        });
        return tasks;
    }
    async updateTasks(updatedTasks, deviceId, req) {
        for (const task of updatedTasks) {
            const status = task.taskStatus
                ? this.mapTaskStatus(task.taskStatus)
                : undefined;
            const severity = task.taskSeverity
                ? this.mapTaskSeverity(task.taskSeverity)
                : undefined;
            const updateResult = await this.taskRepository.update({ id: task.id, deviceId }, {
                ...(status && { taskStatus: status }),
                ...(severity && { taskSeverity: severity }),
                ...(task.taskDescription && {
                    taskDescription: task.taskDescription,
                }),
                ...(task.notes && { notes: task.notes }),
            });
        }
    }
    async getTasksOfWholeWeek(deviceId) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return this.taskRepository.find({
            where: {
                deviceId,
                createdAt: (0, typeorm_2.Between)(startOfWeek, endOfWeek),
            },
            order: { createdAt: 'DESC' },
        });
    }
    mapTaskStatus(status) {
        const lowerCaseStatus = status.toLowerCase();
        return Object.values(constants_1.TaskStatus).find((enumValue) => enumValue.toLowerCase() === lowerCaseStatus);
    }
    mapTaskSeverity(severity) {
        const lowerCaseSeverity = severity.toLowerCase();
        return Object.values(constants_1.TaskSeverity).find((enumValue) => enumValue.toLowerCase() === lowerCaseSeverity);
    }
    async updateStatus(data) {
        const { id, taskStatus } = data;
        return await this.taskRepository.update(id, { taskStatus });
    }
    async getTasks(deviceId, query) {
        const { page = 1, limit = 5, taskStatus } = query;
        if (!deviceId) {
            return {
                advisories: null,
            };
        }
        const whereClause = { deviceId };
        if (taskStatus)
            whereClause.taskStatus = taskStatus;
        const [tasks, total] = await this.taskRepository.findAndCount({
            where: whereClause,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            total,
            page,
            limit,
            tasks,
        };
    }
    async lastEntry(deviceId) {
        if (!deviceId) {
            return {
                task: null,
            };
        }
        const task = await this.taskRepository.findOne({
            where: { deviceId },
            order: { createdAt: 'DESC' },
        });
        return {
            task,
        };
    }
    async getTaskStatusCounts(deviceId) {
        const statuses = Object.values(constants_1.TaskStatus);
        if (!deviceId) {
            return {
                result: null,
            };
        }
        const result = {};
        for (const status of statuses) {
            const count = await this.taskRepository.count({
                where: { taskStatus: status, deviceId },
            });
            result[status] = count;
        }
        return { result: result };
    }
};
exports.SensorBasedTaskService = SensorBasedTaskService;
exports.SensorBasedTaskService = SensorBasedTaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.DeviceTasks)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        firebase_service_1.FirebaseService])
], SensorBasedTaskService);
//# sourceMappingURL=tasks-generation.service.js.map