import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SensorDataEvent } from './sensor-data.event';
import { SensorBasedEventAndTaskMgtService } from '../sensor-based-event-and-task-mgt/sensor-based-event-and-task-mgt.service';

@Injectable()
export class SensorEventHandlerService {
  private readonly logger = new Logger(SensorEventHandlerService.name);

  constructor(
    private readonly sensorTaskService: SensorBasedEventAndTaskMgtService,
  ) {}

  @OnEvent('sensor.data.process')
  async handleSensorData(event: SensorDataEvent) {
    this.logger.log(`Processing advisory for device: ${event.deviceId}`);

    await this.sensorTaskService.addAdvisories(event.deviceId, event.req);

    this.logger.log(
      `✅ Advisory generated for ${event.deviceId}, triggering task creation...`,
    );
    this.sensorTaskService.addTasks(event.deviceId, event.req);

    this.sensorTaskService.updateTasks(event.deviceId, event.req);
  }
}
