import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { SensorDataService } from './sensorData.service';
import { CreateSensorDataDto } from './dto/create-sensorData.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/Pagination-data.dto';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post()
  async addSensorData(@Body() data : CreateSensorDataDto ) {
    return await this.sensorDataService.create(data);
  }

  @Get()
  @ApiBearerAuth()
    @ApiOperation({ summary: 'Get paginated list of sensor data' })
    async findAll(@Query() paginationQuery: PaginationQueryDto, @Req() req) {
      return this.sensorDataService.dataListing(paginationQuery, req)
    }
}
