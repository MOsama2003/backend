import { PartialType } from '@nestjs/mapped-types';
import { CreateSensorBasedEventAndTaskMgtDto } from './create-sensor-based-event-and-task-mgt.dto';

export class UpdateSensorBasedEventAndTaskMgtDto extends PartialType(CreateSensorBasedEventAndTaskMgtDto) {}
