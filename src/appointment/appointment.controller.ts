import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { BookAppointmentDto } from './dto/book-appointments.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AvailabilityQueryDto } from './dto/availability-query.dto';

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentsService: AppointmentService) {}

  @UseGuards(JwtAuthGuard) 
  @Get('counselor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all (past & upcoming) appointments for the counselor.' })
  @ApiResponse({ status: 200, description: 'List of appointments for the counselor' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAppointmentsOfCounselor(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.appointmentsService.getAppointmentsOfCounselor(req.user.id, paginationQuery);
  }

  @UseGuards(JwtAuthGuard) 
  @Get('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all (past & upcoming) appointments for the user.' })
  @ApiResponse({ status: 200, description: 'List of appointments for the user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAppointmentsOfUser(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.appointmentsService.getAppointmentsOfUser(req.user.id, paginationQuery);
  }



  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book an appointment!' })
  @ApiResponse({ status: 200, description: 'Appointment booked successfully!' })
  @ApiBadRequestResponse({
    description: 'Bad Request - Appointment already booked at the selected time OR other validation errors',
    content: {
      'application/json': {
        examples: {
          CounselorAlreadyBooked: {
            summary: 'Counselor is already booked',
            value: {
              statusCode: 400,
              message: 'This counselor is already booked at the selected time.',
              error: 'Bad Request',
            },
          },
          UserAlreadyBooked: {
            summary: 'User has an existing appointment at the same time',
            value: {
              statusCode: 400,
              message: 'This user already has an appointment at the selected time.',
              error: 'Bad Request',
            },
          },
          CounselorNotFound: {
            summary: 'Counselor not found',
            value: {
              statusCode: 400,
              message: 'Counselor not found',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('book')
  async bookAppointment(@Request() req, @Body() bookAppointmentDto: BookAppointmentDto) {
    bookAppointmentDto.userId = req.user.id; 
    return this.appointmentsService.bookAppointment(bookAppointmentDto);
  }

  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @Get('available-slots')
  @ApiOperation({ summary: 'Get available slots for a selected counselor' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input (e.g., missing parameters, invalid date format)' })
  @ApiQuery({ name: 'counselorId', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'date', required: true, type: String, example: '2025-03-25' })
  async getAvailableSlots(@Query() query: AvailabilityQueryDto) {
    return this.appointmentsService.getAvailableSlots(Number(query.counselorId), query.date);
  }

}
