import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class PythonApiService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService);
    generateReport(imageUrls: string[], farmParameters: any): Promise<any>;
    createTasks(farmParameters: any, reportText: string, incompleteTasks: any[]): Promise<any>;
    createAdvisory(farmParameters: any, reportText: string, upcomingTasks: any[], weather_data: any): Promise<any>;
}
