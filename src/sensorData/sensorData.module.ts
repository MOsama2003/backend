import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorData } from './entities/sensorData.entity';
import { SensorDataService } from './sensorData.service';
import { UserModule } from 'src/user/user.module';
import { SensorDataController } from './sensorData.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SensorEventHandlerService } from './sensor-event-handler.service';
import { SensorBasedEventAndTaskMgtModule } from 'src/sensor-based-event-and-task-mgt/sensor-based-event-and-task-mgt.module';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData]), UserModule, forwardRef(() => SensorBasedEventAndTaskMgtModule), EventEmitterModule.forRoot()],
  controllers: [SensorDataController],
  providers: [SensorDataService, SensorEventHandlerService],
  exports: [SensorDataService]
})
export class SensorDataModule {}
