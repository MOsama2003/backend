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
var FarmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmService = exports.TaskStatus = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const farm_entity_1 = require("./entities/farm.entity");
const farm_image_entity_1 = require("./entities/farm-image.entity");
const farm_image_report_entity_1 = require("./entities/farm-image-report.entity");
const farm_task_entity_1 = require("./entities/farm-task.entity");
const farm_advisory_entity_1 = require("./entities/farm-advisory.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const python_api_service_1 = require("./services/python-api.service");
const firebase_service_1 = require("../notifications/firebase.service");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["NOT_STARTED"] = "Not Started";
    TaskStatus["IN_PROGRESS"] = "In Progress";
    TaskStatus["COMPLETED"] = "Completed";
    TaskStatus["CANCELLED"] = "Cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
let FarmService = FarmService_1 = class FarmService {
    constructor(farmRepository, farmImageRepository, farmImageReportRepository, farmTaskRepository, farmAdvisoryRepository, cloudinaryService, pythonApiService, dataSource, notificationService) {
        this.farmRepository = farmRepository;
        this.farmImageRepository = farmImageRepository;
        this.farmImageReportRepository = farmImageReportRepository;
        this.farmTaskRepository = farmTaskRepository;
        this.farmAdvisoryRepository = farmAdvisoryRepository;
        this.cloudinaryService = cloudinaryService;
        this.pythonApiService = pythonApiService;
        this.dataSource = dataSource;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(FarmService_1.name);
    }
    async createFarm(userId, createFarmDto) {
        const existingFarmsCount = await this.farmRepository.count({
            where: { userId }
        });
        const farmNumber = existingFarmsCount + 1;
        const displayId = `Farm-0-${farmNumber}`;
        const farm = this.farmRepository.create({
            userId,
            displayId,
            name: createFarmDto.name,
            farmLocation: createFarmDto.farmLocation,
            totalLandArea: createFarmDto.totalLandArea,
            crop: createFarmDto.crop,
            latitude: createFarmDto.latitude,
            longitude: createFarmDto.longitude,
            soilType: createFarmDto.soilType,
            waterSource: createFarmDto.waterSource,
            sowingDate: new Date(createFarmDto.sowingDate),
            currentGrowthStage: createFarmDto.currentGrowthStage,
            pastPestIssues: createFarmDto.pastPestIssues,
            irrigationType: createFarmDto.irrigationType,
            waterAvailabilityStatus: createFarmDto.waterAvailabilityStatus,
            fertilizersUsed: createFarmDto.fertilizersUsed,
            onboardingCompleted: false,
            additionalDetails: {}
        });
        return this.farmRepository.save(farm);
    }
    async getFarms(userId) {
        return this.farmRepository.find({
            where: { userId },
        });
    }
    async getFarmById(userId, farmId) {
        const farm = await this.farmRepository.findOne({
            where: { id: farmId, userId },
            relations: ['images', 'reports', 'tasks', 'advisories'],
        });
        if (!farm) {
            throw new common_1.NotFoundException('Farm not found');
        }
        if (farm.tasks && farm.tasks.length > 0) {
            const sortedTasks = farm.tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            const latestTaskDate = new Date(sortedTasks[0].createdAt);
            farm.tasks = sortedTasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate.getTime() === latestTaskDate.getTime();
            });
        }
        return farm;
    }
    async updateFarm(userId, farmId, updateFarmDto) {
        const farm = await this.getFarmById(userId, farmId);
        if (updateFarmDto.name !== undefined)
            farm.name = updateFarmDto.name;
        if (updateFarmDto.farmLocation !== undefined)
            farm.farmLocation = updateFarmDto.farmLocation;
        if (updateFarmDto.totalLandArea !== undefined)
            farm.totalLandArea = updateFarmDto.totalLandArea;
        if (updateFarmDto.crop !== undefined)
            farm.crop = updateFarmDto.crop;
        if (updateFarmDto.latitude !== undefined)
            farm.latitude = updateFarmDto.latitude;
        if (updateFarmDto.longitude !== undefined)
            farm.longitude = updateFarmDto.longitude;
        if (updateFarmDto.soilType !== undefined)
            farm.soilType = updateFarmDto.soilType;
        if (updateFarmDto.waterSource !== undefined)
            farm.waterSource = updateFarmDto.waterSource;
        if (updateFarmDto.sowingDate !== undefined)
            farm.sowingDate = new Date(updateFarmDto.sowingDate);
        if (updateFarmDto.currentGrowthStage !== undefined)
            farm.currentGrowthStage = updateFarmDto.currentGrowthStage;
        if (updateFarmDto.pastPestIssues !== undefined)
            farm.pastPestIssues = updateFarmDto.pastPestIssues;
        if (updateFarmDto.irrigationType !== undefined)
            farm.irrigationType = updateFarmDto.irrigationType;
        if (updateFarmDto.waterAvailabilityStatus !== undefined)
            farm.waterAvailabilityStatus = updateFarmDto.waterAvailabilityStatus;
        if (updateFarmDto.fertilizersUsed !== undefined)
            farm.fertilizersUsed = updateFarmDto.fertilizersUsed;
        farm.lastUpdateDate = new Date();
        return this.farmRepository.save(farm);
    }
    async deleteFarm(userId, farmId) {
        console.log("delete called");
        const farm = await this.getFarmById(userId, farmId);
        console.log("farm fetched!");
        for (const image of farm.images) {
            await this.cloudinaryService.deleteFile(image.publicId);
        }
        await this.farmRepository.remove(farm);
    }
    async uploadFarmImages(userId, farmId, files) {
        if (files.length < 3) {
            throw new common_1.BadRequestException('At least 3 images are required');
        }
        const farm = await this.getFarmById(userId, farmId);
        const uploadPromises = files.map(file => this.cloudinaryService.uploadFile(file));
        const uploadResults = await Promise.all(uploadPromises);
        const farmImages = uploadResults.map(result => {
            if (!result) {
                throw new Error('Failed to upload image');
            }
            return this.farmImageRepository.create({
                url: result.secure_url,
                publicId: result.public_id,
                farmId: farm.id,
                uploadDate: new Date(),
            });
        });
        await this.farmImageRepository.save(farmImages);
        return this.processUploadedImages(farm, farmImages);
    }
    async processUploadedImages(farm, farmImages) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const image of farmImages) {
                image.farmId = farm.id;
            }
            await queryRunner.manager.save(farmImages);
            const imageUrls = farmImages.map(image => image.url);
            const farmParameters = {
                crop: farm.crop,
                farmLocation: farm.farmLocation,
                currentGrowthStage: farm.currentGrowthStage,
                soilType: farm.soilType,
                sowingDate: farm.sowingDate instanceof Date
                    ? farm.sowingDate.toISOString()
                    : farm.sowingDate,
                irrigationType: farm.irrigationType,
                waterSource: farm.waterSource,
                waterAvailabilityStatus: farm.waterAvailabilityStatus,
                fertilizersUsed: Array.isArray(farm.fertilizersUsed)
                    ? farm.fertilizersUsed.join(', ')
                    : farm.fertilizersUsed || ''
            };
            const reportData = await this.pythonApiService.generateReport(imageUrls, farmParameters);
            const farmImageReport = this.farmImageReportRepository.create({
                farmId: farm.id,
                reportText: reportData.report,
                summary: reportData.summary,
                reportDate: new Date(),
            });
            await queryRunner.manager.save(farmImageReport);
            const today = new Date();
            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const incompleteTasks = farm.tasks
                .filter(task => {
                return task.status !== TaskStatus.COMPLETED && task.dueDate >= sevenDaysAgo;
            })
                .map(task => ({
                taskId: task.id,
                title: task.title,
                priority: task.priority,
                dueDate: task.dueDate.toISOString(),
                status: task.status,
                description: task.taskDescription,
            }));
            console.log("incompleteTasks", incompleteTasks);
            const taskResponse = await this.pythonApiService.createTasks(farmParameters, reportData.report, incompleteTasks);
            const weather_data = taskResponse.weather;
            const tasksData = Array.isArray(taskResponse.tasks)
                ? taskResponse.tasks
                : (taskResponse.tasks?.tasks || []);
            if (!Array.isArray(tasksData)) {
                throw new Error('Expected tasks data to be an array');
            }
            const farmTasks = tasksData.map(taskData => this.farmTaskRepository.create({
                farmId: farm.id,
                taskId: taskData.taskId,
                title: taskData.title,
                priority: taskData.priority,
                dueDate: new Date(taskData.dueDate),
                status: taskData.status,
                context: taskData.context,
                taskDescription: taskData.taskDescription,
                steps: taskData.steps,
                supportingInformation: taskData.supportingInformation,
                followUp: taskData.followUp,
                dependencies: taskData.dependencies
            }));
            await queryRunner.manager.save(farmTasks);
            const formattedTasks = farmTasks.map(task => ({
                taskId: task.taskId,
                title: task.title,
                priority: task.priority,
                dueDate: task.dueDate.toISOString(),
                status: task.status,
                context: task.context,
                taskDescription: task.taskDescription,
                steps: task.steps,
                supportingInformation: task.supportingInformation,
                followUp: task.followUp,
                dependencies: task.dependencies
            }));
            const advisoryResponse = await this.pythonApiService.createAdvisory(farmParameters, reportData.report, formattedTasks, weather_data);
            const farmAdvisory = this.farmAdvisoryRepository.create({
                farmId: farm.id,
                advisoryData: advisoryResponse,
                advisoryDate: new Date(),
            });
            await queryRunner.manager.save(farmAdvisory);
            farm.lastUpdateDate = new Date();
            farm.onboardingCompleted = true;
            const farmToSave = { ...farm };
            await queryRunner.manager.update(farm_entity_1.Farm, farm.id, {
                lastUpdateDate: farmToSave.lastUpdateDate,
                onboardingCompleted: farmToSave.onboardingCompleted
            });
            await queryRunner.commitTransaction();
            await this.notificationService.sendNotification({
                title: 'New tasks for you farm are available!',
                body: `${farm.displayId} is ready with new information`,
                data: { farmId: String(farm.id) },
            }, +farm.userId);
            return this.getFarmById(farm.userId, farm.id);
        }
        catch (error) {
            this.logger.error(`Failed to process farm images: ${error.message}`);
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateTaskStatus(userId, taskId, status) {
        const task = await this.farmTaskRepository.findOne({
            where: { id: taskId },
            relations: ['farm'],
        });
        if (!task) {
            throw new common_1.NotFoundException('Task not found');
        }
        if (task.farm.userId !== userId) {
            throw new common_1.NotFoundException('Task not found');
        }
        task.status = status;
        return this.farmTaskRepository.save(task);
    }
};
exports.FarmService = FarmService;
exports.FarmService = FarmService = FarmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(farm_entity_1.Farm)),
    __param(1, (0, typeorm_1.InjectRepository)(farm_image_entity_1.FarmImage)),
    __param(2, (0, typeorm_1.InjectRepository)(farm_image_report_entity_1.FarmImageReport)),
    __param(3, (0, typeorm_1.InjectRepository)(farm_task_entity_1.FarmTask)),
    __param(4, (0, typeorm_1.InjectRepository)(farm_advisory_entity_1.FarmAdvisory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService,
        python_api_service_1.PythonApiService,
        typeorm_2.DataSource,
        firebase_service_1.FirebaseService])
], FarmService);
//# sourceMappingURL=farm.service.js.map