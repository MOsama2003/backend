import { forwardRef, Module } from '@nestjs/common';
import { SensorBasedEventAndTaskMgtService } from './sensor-based-event-and-task-mgt.service';
import { SensorBasedEventAndTaskMgtController } from './sensor-based-event-and-task-mgt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorOnboarding } from './entities/sensor-based-event-and-task-mgt.entity';
import { SensorDataModule } from 'src/sensorData/sensorData.module';
import { SensorBasedAdvisoryService } from './advisory-generation.service';
import { DeviceAdvisory } from './entities/advisory.entity';
import { SensorBasedTaskService } from './tasks-generation.service';
import { DeviceTasks } from './entities/task.entity';

@Module({
  controllers: [SensorBasedEventAndTaskMgtController],
  providers: [SensorBasedEventAndTaskMgtService, SensorBasedAdvisoryService, SensorBasedTaskService],
  imports: [TypeOrmModule.forFeature([SensorOnboarding, DeviceAdvisory, DeviceTasks]), SensorDataModule],
})
export class SensorBasedEventAndTaskMgtModule {}
