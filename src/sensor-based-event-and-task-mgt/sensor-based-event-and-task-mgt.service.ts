import { Injectable } from '@nestjs/common';
import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorOnboarding } from './entities/sensor-based-event-and-task-mgt.entity';
import { SensorDataService } from 'src/sensorData/sensorData.service';
import { SensorBasedAdvisoryService } from './advisory-generation.service';
import { SensorBasedTaskService } from './tasks-generation.service';

@Injectable()
export class SensorBasedEventAndTaskMgtService {
  constructor(
    @InjectRepository(SensorOnboarding)
    private readonly farmRepository: Repository<SensorOnboarding>,
    private readonly sensorDataService: SensorDataService,
    private readonly sensorBasedAdvisoryService: SensorBasedAdvisoryService,
    private readonly sensorBasedTaskService: SensorBasedTaskService,
  ) {}

  async create(
    createFarmDto: CreateSensorBasedEventAndTaskMgtDto & { deviceId: string },
  ): Promise<SensorOnboarding> {
    const farm = this.farmRepository.create(createFarmDto);
    return await this.farmRepository.save(farm);
  }

  async addAdvisories(deviceId: string) {
    if (!deviceId) return;
    const latestNKP = await this.sensorDataService.lastTwoEntries(deviceId);
    const farmData = await this.farmRepository.findOne({ where: { deviceId } });
    const body = {
      farm_info: farmData ? JSON.parse(JSON.stringify(farmData)) : null,
      npk_data: latestNKP
        ? latestNKP.map((entry) => JSON.parse(JSON.stringify(entry)))
        : [],
    };
    const response = await fetch('http://0.0.0.0:8082/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to send advisories: ${response.statusText}`);
    }

    const res = await response.json();
    const regex = /```json\n([\s\S]*?)\n```/;
    let match = res?.advisories.match(regex);
    match = match ? match[1] : null;

    return this.sensorBasedAdvisoryService.saveAdvisories(
      JSON.parse(match),
      deviceId,
    );
  }

  async addTasks(deviceId: string) {
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
    const response = await fetch('http://0.0.0.0:8082/generate-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to send advisories: ${response.statusText}`);
    }

    const res = await response.json();
    const regex = /```json\n([\s\S]*?)\n```/;
    let match = res?.tasks.match(regex);
    match = match ? match[1] : null;
    return this.sensorBasedTaskService.saveTasks(JSON.parse(match), deviceId);
  }

  async updateTasks(deviceId: string) {
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
    const response = await fetch('http://0.0.0.0:8082/updated-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to send advisories: ${response.statusText}`);
    }
 
    const res = await response.json();
    const regex = /\[\s*[\s\S]*?\s*\]/; // Matches a JSON array inside square brackets

    let match = res?.updatedTasks.match(regex);
    match = match ? JSON.parse(match[0]) : null;
    return this.sensorBasedTaskService.updateTasks(match, deviceId);
  }
}
