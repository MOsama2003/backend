import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyFarmReport } from './entities/week-summary.entity';

@Injectable()
export class SensorBasedWeeklySummaryService {
  constructor(
    @InjectRepository(WeeklyFarmReport)
    private readonly advisoryRepository: Repository<WeeklyFarmReport>,
  ) {}

  async saveWeeklySummary(
    weeklyReports: {
      farm_health: string[];
      risk_analysis: string[];
      yield_forecast: string[];
    }[],
    deviceId: string,
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

    return this.advisoryRepository.save(reportEntities);
  }
}
