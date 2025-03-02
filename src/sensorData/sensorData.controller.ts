import { Body, Controller, Post } from '@nestjs/common';
import { SensorDataService } from './sensorData.service';
import { CreateSensorDataDto } from './dto/create-sensorData.dto';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post()
  async addSensorData(@Body() data : CreateSensorDataDto ) {
    console.log(data, 'osamaosamasoamamammama')
    return await this.sensorDataService.create(data);
  }
}
