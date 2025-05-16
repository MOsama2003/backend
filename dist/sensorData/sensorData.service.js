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
exports.SensorDataService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sensorData_entity_1 = require("./entities/sensorData.entity");
const user_service_1 = require("../user/user.service");
const firebase_service_1 = require("../notifications/firebase.service");
let SensorDataService = class SensorDataService {
    constructor(sensorDataRepository, userService, notificationService) {
        this.sensorDataRepository = sensorDataRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }
    async create(data) {
        if (!data?.deviceId) {
            throw new common_1.BadRequestException('Device ID is required');
        }
        const user = await this.userService.findByDeviceId(data.deviceId);
        if (!user)
            throw new common_1.UnauthorizedException();
        this.validateSensorData(data);
        const sensorData = this.sensorDataRepository.create({
            ...data,
            userId: user?.id,
        });
        await this.notificationService.sendNotification({
            title: 'New Farm data added',
            body: 'check new data',
            data: { deviceId: data?.deviceId },
        }, user.id);
        return await this.sensorDataRepository.save(sensorData);
    }
    validateSensorData(data) {
        const validRanges = {
            nitrogen: { min: 0, max: 400 },
            potassium: { min: 0, max: 600 },
            phosphorus: { min: 0, max: 400 },
            conductivity: { min: 0, max: 5000 },
            pH: { min: 0, max: 14 },
            humidity: { min: 0, max: 100 },
            temperature: { min: -20, max: 60 },
        };
        for (const [key, range] of Object.entries(validRanges)) {
            const value = data[key];
            if (value === undefined || value === null) {
                throw new common_1.BadRequestException(`${key} value is required`);
            }
            if (typeof value !== 'number' || isNaN(value)) {
                throw new common_1.BadRequestException(`${key} must be a valid number`);
            }
            if (value < range.min || value > range.max) {
                throw new common_1.BadRequestException(`${key} value ${value} is out of range (${range.min}-${range.max})`);
            }
        }
        this.validateBusinessRules(data);
    }
    validateBusinessRules(data) {
        if (data.pH < 5.5 && data.conductivity > 2000) {
            throw new common_1.BadRequestException('Invalid combination: Low pH with high conductivity unlikely');
        }
        if (data.temperature > 40 && data.humidity > 90) {
            throw new common_1.BadRequestException('Invalid combination: High temperature with high humidity unlikely');
        }
    }
    async dataListing(PaginationQueryDto, req) {
        const { page = 1, limit = 10 } = PaginationQueryDto;
        try {
            const currentPage = Math.max(1, page);
            const take = Math.max(1, limit);
            const skip = (currentPage - 1) * take;
            const [sensorData, total] = await this.sensorDataRepository.findAndCount({
                where: { deviceId: req.user.deviceId },
                skip,
                take,
                select: [
                    'id',
                    'nitrogen',
                    'conductivity',
                    'pH',
                    'humidity',
                    'temperature',
                    'potassium',
                    'phosphorus',
                    'createdAt',
                ],
            });
            const pageCount = Math.ceil(total / take);
            const hasNextPage = currentPage < pageCount;
            const hasPrevPage = currentPage > 1;
            return {
                data: sensorData,
                metaData: {
                    totalCount: total,
                    pageCount,
                    page: currentPage,
                    take,
                    hasNextPage,
                    hasPrevPage,
                    itemCount: sensorData.length,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Something went wrong while fetching posts.');
        }
    }
    async lastEntry(deviceId) {
        return await this.sensorDataRepository.findOne({
            where: { deviceId },
            order: { createdAt: 'DESC' },
        });
    }
    async lastTwoEntries(deviceId) {
        return await this.sensorDataRepository.find({
            where: { deviceId },
            order: { createdAt: 'DESC' },
            take: 2,
        });
    }
};
exports.SensorDataService = SensorDataService;
exports.SensorDataService = SensorDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sensorData_entity_1.SensorData)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        firebase_service_1.FirebaseService])
], SensorDataService);
//# sourceMappingURL=sensorData.service.js.map