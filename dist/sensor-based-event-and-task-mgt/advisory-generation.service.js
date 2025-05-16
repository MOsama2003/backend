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
exports.SensorBasedAdvisoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const advisory_entity_1 = require("./entities/advisory.entity");
const firebase_service_1 = require("../notifications/firebase.service");
let SensorBasedAdvisoryService = class SensorBasedAdvisoryService {
    constructor(advisoryRepository, notificationService) {
        this.advisoryRepository = advisoryRepository;
        this.notificationService = notificationService;
    }
    async saveAdvisories(advisories, deviceId, req) {
        const advisoryEntities = advisories.map(advisory => ({
            ...advisory,
            deviceId,
            createdAt: new Date(),
        }));
        if (req?.user?.id) {
            await this.notificationService.sendNotification({
                title: 'New Advisories added',
                body: `New Advisories added for your device`,
                data: { deviceId: deviceId },
            }, +req.user.id);
        }
        return this.advisoryRepository.save(advisoryEntities);
    }
    async getAdvisoryOfWholeWeek(deviceId) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return this.advisoryRepository.find({
            where: {
                deviceId,
                createdAt: (0, typeorm_2.Between)(startOfWeek, endOfWeek),
            },
            order: { createdAt: "DESC" },
        });
    }
    async lastTwoEntries(deviceId) {
        const lastTwoEntries = await this.advisoryRepository.find({
            where: { deviceId },
            order: { id: "DESC" },
            take: 2,
        });
        return lastTwoEntries;
    }
    async getAdvisories(deviceId, query) {
        const { page = 1, limit = 5 } = query;
        if (!deviceId) {
            return {
                advisories: null
            };
        }
        const whereClause = { deviceId };
        const [advisories, total] = await this.advisoryRepository.findAndCount({
            where: whereClause,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            total,
            page,
            limit,
            advisories,
        };
    }
    async lastEntry(deviceId) {
        if (!deviceId) {
            return {
                advisory: null,
            };
        }
        const advisory = await this.advisoryRepository.findOne({
            where: { deviceId },
            order: { createdAt: 'DESC' },
        });
        return {
            advisory,
        };
    }
};
exports.SensorBasedAdvisoryService = SensorBasedAdvisoryService;
exports.SensorBasedAdvisoryService = SensorBasedAdvisoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(advisory_entity_1.DeviceAdvisory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        firebase_service_1.FirebaseService])
], SensorBasedAdvisoryService);
//# sourceMappingURL=advisory-generation.service.js.map