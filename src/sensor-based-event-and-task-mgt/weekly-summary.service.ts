import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyFarmReport } from './entities/week-summary.entity';
import { FirebaseService } from 'src/notifications/firebase.service';
import { GetDeviceAdvisoryDto } from './dto/get-sensor-based-tasks.dto';

@Injectable()
export class SensorBasedWeeklySummaryService {
  constructor(
    @InjectRepository(WeeklyFarmReport)
    private readonly advisoryRepository: Repository<WeeklyFarmReport>,
    private readonly notificationService: FirebaseService,
  ) {}

  async saveWeeklySummary(
    weeklyReports: {
      farm_health: string[];
      risk_analysis: string[];
      yield_forecast: string[];
    }[],
    deviceId: string,
    req,
  ): Promise<WeeklyFarmReport[]> {
    const reportEntities = weeklyReports.map((report) => {
      return this.advisoryRepository.create({
        farmHealth: report.farm_health || [],
        riskAnalysis: report.risk_analysis || [],
        yieldForecast: report.yield_forecast || [],
        deviceId,
        createdAt: new Date(),
      });
    });

    if(req?.user?.id){
      await this.notificationService.sendNotification(
        {
          title: 'Weekly report is here',
          body: 'check your report',
          data: reportEntities,
        },
        +req.user.id,
      );
    }

    return this.advisoryRepository.save(reportEntities);
  }

  async getWeeklyReport(deviceId: string, query: GetDeviceAdvisoryDto) {
    const { page = 1, limit = 5 } = query;
    if (!deviceId) {
      return {
        advisories: null,
      };
    }
    const whereClause: any = { deviceId };
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

  async lastEntry(deviceId: string) {
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
}
