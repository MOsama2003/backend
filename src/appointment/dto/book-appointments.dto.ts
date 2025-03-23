import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookAppointmentDto {
  @ApiProperty({ example: 1, description: 'User ID of the person booking the appointment' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 2, description: 'Counselor ID for the appointment' })
  @IsNumber()
  @IsNotEmpty()
  counselorId: number;

  @ApiProperty({ example: '2025-03-25T10:00:00.000Z', description: 'Appointment date in ISO format' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: Date;
}
