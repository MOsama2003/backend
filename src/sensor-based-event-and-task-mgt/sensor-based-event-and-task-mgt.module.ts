import { Module } from '@nestjs/common';
import { SensorBasedEventAndTaskMgtService } from './sensor-based-event-and-task-mgt.service';
import { SensorBasedEventAndTaskMgtController } from './sensor-based-event-and-task-mgt.controller';

@Module({
  controllers: [SensorBasedEventAndTaskMgtController],
  providers: [SensorBasedEventAndTaskMgtService],
})
export class SensorBasedEventAndTaskMgtModule {}
