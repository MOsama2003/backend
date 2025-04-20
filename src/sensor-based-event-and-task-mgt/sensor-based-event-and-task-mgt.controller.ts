import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { SensorBasedEventAndTaskMgtService } from './sensor-based-event-and-task-mgt.service';
import { GetDeviceAdvisoryDto, GetDeviceTasksDto } from './dto/get-sensor-based-tasks.dto';

@ApiTags('Sensor-Based Event and Task Management')
@Controller('sensor-based-event-and-task-mgt')
export class SensorBasedEventAndTaskMgtController {
  constructor(
    private readonly sensorBasedEventAndTaskMgtService: SensorBasedEventAndTaskMgtService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Farm event/task created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateSensorBasedEventAndTaskMgtDto })
  async createFarm(
    @Body() createFarmDto: CreateSensorBasedEventAndTaskMgtDto,
    @Req() req: any
  ) {
    return this.sensorBasedEventAndTaskMgtService.create({
      ...createFarmDto,
     deviceId:  req.user.deviceId,
    });
  }

  @Get('/advisory/:deviceId')
  @ApiBearerAuth()
  async getAdvisory(@Param('deviceId') deviceId: string, @Req() req) {
    return this.sensorBasedEventAndTaskMgtService.addAdvisories(deviceId, req);
  }

  @Put('/farm-details')
  @ApiBearerAuth()
  @ApiBody({ type: CreateSensorBasedEventAndTaskMgtDto })
  async updateFarmDetails(
    @Body() updateFarmDto: CreateSensorBasedEventAndTaskMgtDto,
    @Req() req: any
  ) {
    return this.sensorBasedEventAndTaskMgtService.update(req.user.deviceId, updateFarmDto);
  }

  @Get('/farm-details')
  @ApiBearerAuth()
  async getFarmDetails(@Req() req: any) {
    return this.sensorBasedEventAndTaskMgtService.getFormByDeviceId(req.user.deviceId);
  }

  @Get('/task/:deviceId')
  @ApiBearerAuth()
  async getTask(@Param('deviceId') deviceId: string, @Req() req) {
    return this.sensorBasedEventAndTaskMgtService.addTasks(deviceId, req);
  }

  @Get('/update-tasks/:deviceId')
  @ApiBearerAuth()
  async updateTasks(@Param('deviceId') deviceId: string, @Req() req) {
    return this.sensorBasedEventAndTaskMgtService.updateTasks(deviceId, req);
  }

  @Get('/weekly-report/:deviceId')
  @ApiBearerAuth()
  async generateReport(@Param('deviceId') deviceId: string, @Req() req) {
    return this.sensorBasedEventAndTaskMgtService.weeklyReport(deviceId, req);
  }

  @Patch('/update-task-status/:taskId')
  @ApiBearerAuth()
  @ApiParam({ name: 'taskId', type: String, description: 'ID of the task' })
  async updateTaskStatus(
    @Param('taskId') id: string,
    @Body() body: UpdateTaskStatusDto,
  ) {
    const { taskStatus } = body;
    return this.sensorBasedEventAndTaskMgtService.updateTaskStatus({
      id,
      taskStatus,
    });
  }

  @Get('/task-listing')
  @ApiBearerAuth()
  async taskListing(@Req() req: any, @Query() query: GetDeviceTasksDto) {
    return this.sensorBasedEventAndTaskMgtService.getTasks(req.user.deviceId, query)
  }

  @Get('/advisory-listing')
  @ApiBearerAuth()
  async advisoryListing(@Req() req: any, @Query() query: GetDeviceAdvisoryDto) {
    return this.sensorBasedEventAndTaskMgtService.getAdvisories(req.user.deviceId, query)
  }

  @Get('/weekly-reports-listing')
  @ApiBearerAuth()
  async reportListing(@Req() req: any, @Query() query: GetDeviceAdvisoryDto) {
    return this.sensorBasedEventAndTaskMgtService.getWeeklyReport(req.user.deviceId, query)
  }

  @Get('/dashboard-listing')
  @ApiBearerAuth()
  async dashboard(@Req() req: any) {
    return this.sensorBasedEventAndTaskMgtService.dashboard(req.user.deviceId)
  }
}
