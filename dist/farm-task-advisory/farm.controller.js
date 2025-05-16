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
exports.FarmController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const create_farm_dto_1 = require("./dto/create-farm.dto");
const update_farm_dto_1 = require("./dto/update-farm.dto");
const update_task_status_dto_1 = require("./dto/update-task-status.dto");
const farm_task_entity_1 = require("./entities/farm-task.entity");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const farm_service_1 = require("./farm.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const swagger_1 = require("@nestjs/swagger");
let FarmController = class FarmController {
    constructor(farmService, cloudinaryService) {
        this.farmService = farmService;
        this.cloudinaryService = cloudinaryService;
    }
    async createFarm(req, createFarmDto) {
        return this.farmService.createFarm(req.user.id, createFarmDto);
    }
    async getFarms(req) {
        return this.farmService.getFarms(req.user.id);
    }
    async getFarm(req, id) {
        const farm = await this.farmService.getFarmById(req.user.id, id);
        return {
            ...farm,
        };
    }
    async updateFarm(req, id, updateFarmDto) {
        return this.farmService.updateFarm(req.user.id, id, updateFarmDto);
    }
    async deleteFarm(req, id) {
        return this.farmService.deleteFarm(req.user.id, id);
    }
    async uploadFarmImages(req, id, files) {
        if (!files.images || files.images.length < 3) {
            throw new common_1.BadRequestException('At least 3 images are required');
        }
        return this.farmService.uploadFarmImages(req.user.id, id, files.images);
    }
    async updateTaskStatus(req, taskId, updateTaskStatusDto) {
        return this.farmService.updateTaskStatus(req.user.id, taskId, updateTaskStatusDto.status);
    }
};
exports.FarmController = FarmController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_farm_dto_1.CreateFarmDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "createFarm", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "getFarms", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "getFarm", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_farm_dto_1.UpdateFarmDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "updateFarm", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "deleteFarm", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload farm images' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Farm ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Farm images (min 3, max 5)',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 5 },
    ], {
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        }
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "uploadFarmImages", null);
__decorate([
    (0, common_1.Put)('tasks/:taskId/status'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update farm task status' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'ID of the task to be updated' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status updated successfully', type: farm_task_entity_1.FarmTask }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found or does not belong to the user' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_task_status_dto_1.UpdateTaskStatusDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "updateTaskStatus", null);
exports.FarmController = FarmController = __decorate([
    (0, swagger_1.ApiTags)('farms'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('farm'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [farm_service_1.FarmService,
        cloudinary_service_1.CloudinaryService])
], FarmController);
//# sourceMappingURL=farm.controller.js.map