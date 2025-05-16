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
exports.SensorBasedWeeklySummaryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const week_summary_entity_1 = require("./entities/week-summary.entity");
const firebase_service_1 = require("../notifications/firebase.service");
let SensorBasedWeeklySummaryService = class SensorBasedWeeklySummaryService {
    constructor(advisoryRepository, notificationService) {
        this.advisoryRepository = advisoryRepository;
        this.notificationService = notificationService;
    }
    async saveWeeklySummary(weeklyReports, deviceId, req) {
        if (weeklyReports[0].risk_analysis.length === 0 || weeklyReports[0].farm_health.length === 0 || weeklyReports[0].yield_forecast.length === 0) {
            return {
                status: 200,
                message: 'no report there'
            };
        }
        const reportEntities = weeklyReports.map((report) => {
            return this.advisoryRepository.create({
                farmHealth: report.farm_health || [],
                riskAnalysis: report.risk_analysis || [],
                yieldForecast: report.yield_forecast || [],
                deviceId,
                createdAt: new Date(),
            });
        });
        if (req?.user?.id) {
            await this.notificationService.sendNotification({
                title: 'Weekly report is here',
                body: 'check your report',
                data: { deviceId: deviceId },
            }, +req.user.id);
        }
        return this.advisoryRepository.save(reportEntities);
    }
    async getWeeklyReport(deviceId, query) {
        const { page = 1, limit = 5 } = query;
        if (!deviceId) {
            return {
                advisories: null,
            };
        }
        const whereClause = { deviceId };
        const [weeklyReports, total] = await this.advisoryRepository.findAndCount({
            where: whereClause,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            total,
            page,
            limit,
            weeklyReports,
        };
    }
    async lastEntry(deviceId) {
        if (!deviceId) {
            return {
                report: null,
            };
        }
        const report = await this.advisoryRepository.findOne({
            where: { deviceId },
            order: { createdAt: 'DESC' },
        });
        return {
            report,
        };
    }
};
exports.SensorBasedWeeklySummaryService = SensorBasedWeeklySummaryService;
exports.SensorBasedWeeklySummaryService = SensorBasedWeeklySummaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(week_summary_entity_1.WeeklyFarmReport)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        firebase_service_1.FirebaseService])
], SensorBasedWeeklySummaryService);
//# sourceMappingURL=weekly-summary.service.js.map