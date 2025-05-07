// farm/services/python-api.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PythonApiService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(PythonApiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('PYTHON_API_URL') || 'http://localhost:8000';
    
    if (this.baseUrl.endsWith('/')) {
      this.baseUrl = this.baseUrl.slice(0, -1);
    }
  }


  async generateReport(imageUrls: string[], farmParameters: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/generate-report`, { 
          image_urls: imageUrls, 
          parameters: farmParameters 
        })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to generate report: ${error.message}`);
      throw error;
    }
  }


  async createTasks(farmParameters: any, reportText: string, incompleteTasks: any[]): Promise<any> {
    try {
      const payload = {
        parameters: farmParameters,
        farm_report: reportText,
        previous_tasks: JSON.stringify(incompleteTasks)
      };

      this.logger.debug('Sending task creation request');
      
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/create-tasks`, payload)
      );
      
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create tasks: ${error.message}`);
      throw error;
    }
  }


  async createAdvisory(farmParameters: any, reportText: string, upcomingTasks: any[], weather_data: any): Promise<any> {
    try {
      const payload = {
        parameters: farmParameters,
        farm_report: reportText,
        upcoming_tasks: JSON.stringify(upcomingTasks),
        weather_data
      };

      this.logger.debug('Sending advisory creation request');
      
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/create-advisory`, payload)
      );
      
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create advisory: ${error.message}`);
      throw error;
    }
  }
}