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
exports.DeviceLocDetailsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_service_1 = require("../user/user.service");
const typeorm_2 = require("typeorm");
const deviceLocDetails_entity_1 = require("./entities/deviceLocDetails.entity");
let DeviceLocDetailsService = class DeviceLocDetailsService {
    constructor(deviceLocDetailRepository, userService) {
        this.deviceLocDetailRepository = deviceLocDetailRepository;
        this.userService = userService;
    }
    validateCoordinates(latitude, longitude) {
        if (latitude < -90 || latitude > 90) {
            throw new common_1.BadRequestException('Invalid latitude value. Must be between -90 and 90.');
        }
        if (longitude < -180 || longitude > 180) {
            throw new common_1.BadRequestException('Invalid longitude value. Must be between -180 and 180.');
        }
    }
    async createOrUpdate(data) {
        if (!data?.deviceId) {
            throw new common_1.BadRequestException('Device ID is required');
        }
        const user = await this.userService.findByDeviceId(data.deviceId);
        if (!user)
            throw new common_1.UnauthorizedException();
        this.validateCoordinates(data?.latitude, data?.longitude);
        const existingEntry = await this.deviceLocDetailRepository.findOne({
            where: { deviceId: data.deviceId },
        });
        if (existingEntry) {
            await this.deviceLocDetailRepository.update(existingEntry.id, {
                ...data,
                userId: user.id,
            });
            return {
                message: 'Location updated successfully',
                deviceId: data.deviceId,
            };
        }
        else {
            const newEntry = this.deviceLocDetailRepository.create({
                ...data,
                userId: user.id,
            });
            return await this.deviceLocDetailRepository.save(newEntry);
        }
    }
    async getByDeviceId(deviceId) {
        console.log(deviceId, 'dddddddddddddddd');
        const location = await this.deviceLocDetailRepository.findOne({
            where: { deviceId }
        });
        if (!location) {
            throw new common_1.NotFoundException(`Location for device ${deviceId} not found`);
        }
        return location;
    }
};
exports.DeviceLocDetailsService = DeviceLocDetailsService;
exports.DeviceLocDetailsService = DeviceLocDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deviceLocDetails_entity_1.DeviceLocDetails)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], DeviceLocDetailsService);
//# sourceMappingURL=deviceLocDetails.service.js.map