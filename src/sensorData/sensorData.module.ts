import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorData } from './entities/sensorData.entity';
import { SensorDataService } from './sensorData.service';
import { UserModule } from 'src/user/user.module';
import { SensorDataController } from './sensorData.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData]), UserModule],
  controllers: [SensorDataController],
  providers: [SensorDataService],
  exports: [SensorDataService]
})
export class SensorDataModule {}
