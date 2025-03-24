import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyFarmReport } from './entities/week-summary.entity';
import { FirebaseService } from 'src/notifications/firebase.service';

@Injectable()
export class SensorBasedWeeklySummaryService {
  constructor(
    @InjectRepository(WeeklyFarmReport)
    private readonly advisoryRepository: Repository<WeeklyFarmReport>,
    private readonly notificationService: FirebaseService
  ) {}

  async saveWeeklySummary(
    weeklyReports: {
      farm_health: string[];
      risk_analysis: string[];
      yield_forecast: string[];
    }[],
    deviceId: string,
    req
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

    await this.notificationService.sendNotification({
      title : 'Weekly report is here',
      body: 'check your report',
      data: reportEntities
    }, +req.user.id)
    

    return this.advisoryRepository.save(reportEntities);
  }
}
