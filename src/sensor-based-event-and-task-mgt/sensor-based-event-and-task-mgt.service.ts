import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SensorDataService } from 'src/sensorData/sensorData.service';
import { Repository } from 'typeorm';
import { SensorBasedAdvisoryService } from './advisory-generation.service';
import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { SensorOnboarding } from './entities/sensor-based-event-and-task-mgt.entity';
import { SensorBasedTaskService } from './tasks-generation.service';
import { SensorBasedWeeklySummaryService } from './weekly-summary.service';
import {
  GetDeviceAdvisoryDto,
  GetDeviceTasksDto,
} from './dto/get-sensor-based-tasks.dto';

@Injectable()
export class SensorBasedEventAndTaskMgtService {
  constructor(
    @InjectRepository(SensorOnboarding)
    private readonly farmRepository: Repository<SensorOnboarding>,
    private readonly sensorDataService: SensorDataService,
    private readonly sensorBasedAdvisoryService: SensorBasedAdvisoryService,
    private readonly sensorBasedTaskService: SensorBasedTaskService,
    private readonly sensorBasedWeeklySummaryService: SensorBasedWeeklySummaryService,
  ) {}

  async create(
    createFarmDto: CreateSensorBasedEventAndTaskMgtDto & { deviceId: string },
  ): Promise<SensorOnboarding> {
    const farm = this.farmRepository.create(createFarmDto);
    return await this.farmRepository.save(farm);
  }

  async getFormByDeviceId(
    deviceId: string,
  ): Promise<
    { found: boolean; data: SensorOnboarding | null; deviceId: string }[]
  > {
    if (!deviceId) {
      return [
        {
          found: false,
          data: null,
          deviceId: deviceId ?? '',
        },
      ];
    }

    const farm = await this.farmRepository.findOne({ where: { deviceId } });

    return [
      {
        found: !!farm,
        data: farm || null,
        deviceId,
      },
    ];
  }

  async update(
    deviceId: string,
    updateFarmDto: CreateSensorBasedEventAndTaskMgtDto,
  ) {
    const farm = await this.farmRepository.findOne({ where: { deviceId } });

    if (!farm) {
      throw new NotFoundException(`Farm with device ID ${deviceId} not found`);
    }

    const updatedFarm = this.farmRepository.merge(farm, updateFarmDto);
    await this.farmRepository.save(updatedFarm);

    return { message: `Device ${deviceId} updated!` };
  }

  async addAdvisories(deviceId: string, req) {
    if (!deviceId) return;
    const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
    const farmData = await this.farmRepository.findOne({ where: { deviceId } });
    const body = {
      farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
      npk_data: latestNKP
        ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
    };

    const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    

    if (!response.ok) {
      throw new Error(`Failed to send advisories: ${response.statusText}`);
    }

    const res = await response.json();
    
    const advisories =
      typeof res.advisories === 'string'
        ? JSON.parse(res.advisories)
        : res.advisories;
    const advArray = advisories?.advisories ?? [];
    if (advArray.length === 0) {
      return {
        status: 200,
        message: 'No advisories to save.',
      };
    }
    return this.sensorBasedAdvisoryService.saveAdvisories(
      advArray,
      deviceId,
      req,
    );
  }

  async addTasks(deviceId: string, req) {
    if (!deviceId) return;
    const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
    const farmData = await this.farmRepository.findOne({ where: { deviceId } });
    const advisories =
      await this.sensorBasedAdvisoryService.lastTwoEntries(deviceId);
    const body = {
      farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
      npk_data: latestNKP
        ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
      advisories: advisories
        ? advisories.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
    };
    const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/generate-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to send advisories: ${response.statusText}`);
    }

    const res = await response.json();
    const tasks =
      typeof res.tasks === 'string' ? JSON.parse(res.tasks) : res.tasks;

     // If it's empty, just return 200
    if (tasks.length === 0) {
      return {
        status: 200,
        message: 'No tasks to save.',
      };
    }

    return this.sensorBasedTaskService.saveTasks(tasks, deviceId, req);
  }

  async updateTasks(deviceId: string, req) {
    if (!deviceId) return;
    const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
    const farmData = await this.farmRepository.findOne({ where: { deviceId } });
    const advisories =
      await this.sensorBasedAdvisoryService.lastTwoEntries(deviceId);
    const tasks = await this.sensorBasedTaskService.unCompleteTasks(deviceId);
    const body = {
      farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
      npk_data: latestNKP
        ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
      advisories: advisories
        ? advisories.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
      tasks: tasks
        ? tasks.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
    };
    const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/updated-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to send advisories: ${response.statusText}`);
    }

    const res = await response.json();
    const updatedTask =
      typeof res.updatedTasks === 'string'
        ? JSON.parse(res.updatedTasks)
        : res.updatedTasks;

    if (updatedTask.length === 0) {
      return {
        status: 200,
        message: 'No tasks to update.',
      };
    }

    return this.sensorBasedTaskService.updateTasks(updatedTask, deviceId, req);
  }

  async weeklyReport(deviceId: string, req) {
    if (!deviceId) return;
    const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
    const farmData = await this.farmRepository.findOne({ where: { deviceId } });
    const advisories =
      await this.sensorBasedAdvisoryService.getAdvisoryOfWholeWeek(deviceId);
    const tasks =
      await this.sensorBasedTaskService.getTasksOfWholeWeek(deviceId);
    const body = {
      farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
      npk_data: latestNKP
        ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
      advisories: advisories
        ? advisories.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
      tasks: tasks
        ? tasks.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
    };
    const response = await fetch('https://device-ai2-cke2bhfcdrf0f5hk.southeastasia-01.azurewebsites.net/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to send advisories: ${response.statusText}`);
    }

    const res = await response.json();
    const parsed =
      typeof res.weeklySummary === 'string'
        ? JSON.parse(res.weeklySummary)
        : res.weeklySummary;

    const weeklySummaryArray = [parsed];

    // If it's empty, just return 200
    if (weeklySummaryArray.length === 0) {
      return {
        status: 200,
        message: 'No weekly summary to save.',
      };
    }

    return this.sensorBasedWeeklySummaryService.saveWeeklySummary(
      weeklySummaryArray,
      deviceId,
      req,
    );
  }

  async updateTaskStatus(data: UpdateTaskStatusDto) {
    const { id, taskStatus } = data;
    return this.sensorBasedTaskService.updateStatus({ id, taskStatus });
  }

  async getTasks(deviceId: string, query: GetDeviceTasksDto) {
    return this.sensorBasedTaskService.getTasks(deviceId, query);
  }

  async getAdvisories(deviceId: string, query: GetDeviceAdvisoryDto) {
    return this.sensorBasedAdvisoryService.getAdvisories(deviceId, query);
  }

  async getWeeklyReport(deviceId: string, query: GetDeviceAdvisoryDto) {
    return this.sensorBasedWeeklySummaryService.getWeeklyReport(
      deviceId,
      query,
    );
  }

  async dashboard(deviceId: string) {
    const task = await this.sensorBasedTaskService.lastEntry(deviceId);
    const advisory = await this.sensorBasedAdvisoryService.lastEntry(deviceId);
    const report =
      await this.sensorBasedWeeklySummaryService.lastEntry(deviceId);
    return {
      ...task,
      ...advisory,
      ...report,
    };
  }

  async getTaskStatusCounts(deviceId: string) {
    return this.sensorBasedTaskService.getTaskStatusCounts(deviceId);
  }
}
