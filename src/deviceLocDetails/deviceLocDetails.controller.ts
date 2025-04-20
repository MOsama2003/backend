import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { DeviceLocDetailsService } from './deviceLocDetails.service';
import { CreateDeviceLocDetails } from './dto/create-deviceLocDetails.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('sensor-location-data')
export class DeviceLocDetailsController {
  constructor(
    private readonly deviceLocDetailsService: DeviceLocDetailsService,
  ) {}

  @Post()
  async addOrUpdateSensorData(@Body() data: CreateDeviceLocDetails) {
    return await this.deviceLocDetailsService.createOrUpdate(data);
  }

  // device-loc-details.controller.ts

  @Get('latest')
  @ApiBearerAuth()
  async getSensorLocation(@Req() req: any) {
    console.log(req.user,'sssssssss')
    return this.deviceLocDetailsService.getByDeviceId(req.user.deviceId);
  }
}
