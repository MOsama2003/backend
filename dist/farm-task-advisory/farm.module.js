"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const farm_controller_1 = require("./farm.controller");
const farm_service_1 = require("./farm.service");
const farm_entity_1 = require("./entities/farm.entity");
const farm_image_report_entity_1 = require("./entities/farm-image-report.entity");
const farm_task_entity_1 = require("./entities/farm-task.entity");
const farm_advisory_entity_1 = require("./entities/farm-advisory.entity");
const python_api_service_1 = require("./services/python-api.service");
const farm_image_entity_1 = require("./entities/farm-image.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const notifications_module_1 = require("../notifications/notifications.module");
let FarmModule = class FarmModule {
};
exports.FarmModule = FarmModule;
exports.FarmModule = FarmModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                farm_entity_1.Farm,
                farm_image_entity_1.FarmImage,
                farm_image_report_entity_1.FarmImageReport,
                farm_task_entity_1.FarmTask,
                farm_advisory_entity_1.FarmAdvisory
            ]),
            axios_1.HttpModule,
            notifications_module_1.NotificationsModule
        ],
        controllers: [farm_controller_1.FarmController],
        providers: [farm_service_1.FarmService, python_api_service_1.PythonApiService, cloudinary_service_1.CloudinaryService],
        exports: [farm_service_1.FarmService],
    })
], FarmModule);
//# sourceMappingURL=farm.module.js.map