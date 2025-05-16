import { Repository } from 'typeorm';
import { WeeklyFarmReport } from './entities/week-summary.entity';
import { FirebaseService } from 'src/notifications/firebase.service';
import { GetDeviceAdvisoryDto } from './dto/get-sensor-based-tasks.dto';
export declare class SensorBasedWeeklySummaryService {
    private readonly advisoryRepository;
    private readonly notificationService;
    constructor(advisoryRepository: Repository<WeeklyFarmReport>, notificationService: FirebaseService);
    saveWeeklySummary(weeklyReports: {
        farm_health: string[];
        risk_analysis: string[];
        yield_forecast: string[];
    }[], deviceId: string, req: any): Promise<WeeklyFarmReport[] | {
        status: number;
        message: string;
    }>;
    getWeeklyReport(deviceId: string, query: GetDeviceAdvisoryDto): Promise<{
        advisories: null;
        total?: undefined;
        page?: undefined;
        limit?: undefined;
        weeklyReports?: undefined;
    } | {
        total: number;
        page: number;
        limit: number;
        weeklyReports: WeeklyFarmReport[];
        advisories?: undefined;
    }>;
    lastEntry(deviceId: string): Promise<{
        report: WeeklyFarmReport | null;
    }>;
}
