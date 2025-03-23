import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsISO8601 } from 'class-validator';

export class AvailabilityQueryDto {
  @ApiProperty({ example: '1', description: 'Counselor ID (must be a number)' })
  @IsNotEmpty()
  @IsNumberString()
  counselorId: string; // Keep it as string because query params are strings

  @ApiProperty({ example: '2025-03-25', description: 'Date in YYYY-MM-DD format' })
  @IsNotEmpty()
  @IsISO8601()
  date: string;
}
