import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/constants';

export class GetDeviceTasksDto {
  @ApiProperty({
    enum: TaskStatus,
    required: false,
    description: 'Optional status to filter tasks (e.g., PENDING, COMPLETED)',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  taskStatus?: TaskStatus;

  @ApiProperty({
    required: false,
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    required: false,
    example: 10,
    description: 'Number of tasks per page',
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}


export class GetDeviceAdvisoryDto {
  @ApiProperty({
    required: false,
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    required: false,
    example: 10,
    description: 'Number of tasks per page',
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
