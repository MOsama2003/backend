import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { SensorDataService } from './sensorData.service';
import { CreateSensorDataDto } from './dto/create-sensorData.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/Pagination-data.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SensorDataEvent } from 'src/sensorData/sensor-data.event';

@Controller('sensor-data')
export class SensorDataController {
  constructor(
    private readonly sensorDataService: SensorDataService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async addSensorData(@Body() data: CreateSensorDataDto, @Req() req) {
    const sensorData = await this.sensorDataService.create(data);
    this.eventEmitter.emit(
      'sensor.data.process',
      new SensorDataEvent(data.deviceId, req),
    );
    return sensorData;
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated list of sensor data' })
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Req() req) {
    return this.sensorDataService.dataListing(paginationQuery, req);
  }
}
