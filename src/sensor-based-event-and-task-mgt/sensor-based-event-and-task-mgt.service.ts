import { Injectable } from '@nestjs/common';
import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';
import { UpdateSensorBasedEventAndTaskMgtDto } from './dto/update-sensor-based-event-and-task-mgt.dto';

@Injectable()
export class SensorBasedEventAndTaskMgtService {
  create(createSensorBasedEventAndTaskMgtDto: CreateSensorBasedEventAndTaskMgtDto) {
    return 'This action adds a new sensorBasedEventAndTaskMgt';
  }

  findAll() {
    return `This action returns all sensorBasedEventAndTaskMgt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sensorBasedEventAndTaskMgt`;
  }

  update(id: number, updateSensorBasedEventAndTaskMgtDto: UpdateSensorBasedEventAndTaskMgtDto) {
    return `This action updates a #${id} sensorBasedEventAndTaskMgt`;
  }

  remove(id: number) {
    return `This action removes a #${id} sensorBasedEventAndTaskMgt`;
  }
}
