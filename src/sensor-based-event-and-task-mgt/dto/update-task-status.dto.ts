import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsDateString, IsString, IsNumber, IsArray } from 'class-validator';
import {
  TaskStatus
} from '../../constants';

export class UpdateTaskStatusDto {
  
  @ApiProperty({ description: 'Task id', required: true })
  @IsNumber()
  id: string;

  @ApiProperty({ enum: TaskStatus, description: 'Status of Task' })
  @IsEnum(TaskStatus)
  taskStatus: TaskStatus;
}
