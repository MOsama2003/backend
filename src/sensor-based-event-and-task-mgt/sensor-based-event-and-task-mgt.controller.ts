import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SensorBasedEventAndTaskMgtService } from './sensor-based-event-and-task-mgt.service';
import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';

@ApiTags('Sensor-Based Event and Task Management') 
@Controller('sensor-based-event-and-task-mgt')
export class SensorBasedEventAndTaskMgtController {
  constructor(
    private readonly sensorBasedEventAndTaskMgtService: SensorBasedEventAndTaskMgtService,
  ) {}

  @Post(':deviceId')
  @ApiOperation({ summary: 'Create a new farm event/task for a given device' })
  @ApiParam({ name: 'deviceId', required: true, description: 'ID of the device' })
  @ApiResponse({ status: 201, description: 'Farm event/task created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
   @ApiBearerAuth()
  @ApiBody({ type: CreateSensorBasedEventAndTaskMgtDto }) 
  async createFarm(
    @Param('deviceId') deviceId: string,
    @Body() createFarmDto: CreateSensorBasedEventAndTaskMgtDto,
  ) {
    return this.sensorBasedEventAndTaskMgtService.create({
      ...createFarmDto,
      deviceId,
    });
  }

  @Get('/advisory/:deviceId')
  @ApiBearerAuth()
  async getAdvisory(@Param('deviceId') deviceId: string) {
    return this.sensorBasedEventAndTaskMgtService.addAdvisories(deviceId)
  }

  @Get('/task/:deviceId')
  @ApiBearerAuth()
  async getTask(@Param('deviceId') deviceId: string) {
    return this.sensorBasedEventAndTaskMgtService.addTasks(deviceId)
  }
  
  @Get('/update-tasks/:deviceId')
  @ApiBearerAuth()
  async updateTasks(@Param('deviceId') deviceId: string) {
    return this.sensorBasedEventAndTaskMgtService.updateTasks(deviceId)
  }
}
