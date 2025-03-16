import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SensorBasedEventAndTaskMgtService } from './sensor-based-event-and-task-mgt.service';
import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';
import { UpdateSensorBasedEventAndTaskMgtDto } from './dto/update-sensor-based-event-and-task-mgt.dto';

@Controller('sensor-based-event-and-task-mgt')
export class SensorBasedEventAndTaskMgtController {
  constructor(private readonly sensorBasedEventAndTaskMgtService: SensorBasedEventAndTaskMgtService) {}

  @Post()
  create(@Body() createSensorBasedEventAndTaskMgtDto: CreateSensorBasedEventAndTaskMgtDto) {
    return this.sensorBasedEventAndTaskMgtService.create(createSensorBasedEventAndTaskMgtDto);
  }

  @Get()
  findAll() {
    return this.sensorBasedEventAndTaskMgtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensorBasedEventAndTaskMgtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSensorBasedEventAndTaskMgtDto: UpdateSensorBasedEventAndTaskMgtDto) {
    return this.sensorBasedEventAndTaskMgtService.update(+id, updateSensorBasedEventAndTaskMgtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sensorBasedEventAndTaskMgtService.remove(+id);
  }
}
