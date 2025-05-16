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
var PythonApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonApiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let PythonApiService = PythonApiService_1 = class PythonApiService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(PythonApiService_1.name);
        this.baseUrl = 'https://agrisense-ai-eedsdvg4aja6bhb5.southeastasia-01.azurewebsites.net';
        if (this.baseUrl.endsWith('/')) {
            this.baseUrl = this.baseUrl.slice(0, -1);
        }
    }
    async generateReport(imageUrls, farmParameters) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/generate-report`, {
                image_urls: imageUrls,
                parameters: farmParameters
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to generate report: ${error.message}`);
            throw error;
        }
    }
    async createTasks(farmParameters, reportText, incompleteTasks) {
        try {
            const payload = {
                parameters: farmParameters,
                farm_report: reportText,
                previous_tasks: JSON.stringify(incompleteTasks)
            };
            this.logger.debug('Sending task creation request');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/create-tasks`, payload));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to create tasks: ${error.message}`);
            throw error;
        }
    }
    async createAdvisory(farmParameters, reportText, upcomingTasks, weather_data) {
        try {
            const payload = {
                parameters: farmParameters,
                farm_report: reportText,
                upcoming_tasks: JSON.stringify(upcomingTasks),
                weather_data
            };
            this.logger.debug('Sending advisory creation request');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/create-advisory`, payload));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to create advisory: ${error.message}`);
            throw error;
        }
    }
};
exports.PythonApiService = PythonApiService;
exports.PythonApiService = PythonApiService = PythonApiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], PythonApiService);
//# sourceMappingURL=python-api.service.js.map