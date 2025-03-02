import { Body, Controller, Post } from '@nestjs/common';
import { DeviceLocDetailsService } from './deviceLocDetails.service';
import { CreateDeviceLocDetails } from './dto/create-deviceLocDetails.dto';

@Controller('sensor-location-data')
export class DeviceLocDetailsController {
  constructor(private readonly deviceLocDetailsService: DeviceLocDetailsService) {}

  @Post()
  async addOrUpdateSensorData(@Body() data: CreateDeviceLocDetails) {
    return await this.deviceLocDetailsService.createOrUpdate(data);
  }
}
