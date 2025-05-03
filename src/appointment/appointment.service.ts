import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { BookAppointmentDto } from './dto/book-appointments.dto';
import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(RequestedCounsellar)
    private readonly counselorRepository: Repository<RequestedCounsellar>,
  ) {}


  async getAppointmentsOfCounselor(counselorId: number, paginationQuery: PaginationQueryDto) {
    const { page, limit = 10, upcoming } = paginationQuery;
    counselorId = 10
    const currentDate = new Date();
    
    let whereCondition: any = { counselor: { id: counselorId } };
    
    if (upcoming === true) {
      whereCondition = {
        counselor: { id: counselorId },
        appointmentDate: MoreThanOrEqual(currentDate)
      };
    } else if (upcoming === false) {
      whereCondition = {
        counselor: { id: counselorId },
        appointmentDate: LessThan(currentDate)
      };
    } else if (upcoming === undefined || upcoming === null) {
      whereCondition = { 
        counselor: { id: counselorId }, 
      };
    }
    
    const [appointments, total] = await this.appointmentRepository.findAndCount({
      where: whereCondition,
      relations: ['counselor'],
      take: limit,
      skip: (page - 1) * limit,
      order: { appointmentDate: 'DESC' },
    });
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      metaData: {
        total,
        currentPage: page,
        totalPages,
        limit
      },
      data: appointments,
    };
  }

  async getAppointmentsOfUser(userId: number, paginationQuery: PaginationQueryDto) {
    const { page, limit = 10, upcoming } = paginationQuery;
    const currentDate = new Date();

    let whereCondition: any = { userId };
    
    if (upcoming === true) {
      whereCondition = { 
        userId, 
        appointmentDate: MoreThanOrEqual(currentDate) 
      };
    } else if (upcoming === false) {
      whereCondition = { 
        userId, 
        appointmentDate: LessThan(currentDate) 
      };
    } else if (upcoming === undefined || upcoming === null) {
      whereCondition = { 
        userId, 
      };
    }
    
    const [appointments, total] = await this.appointmentRepository.findAndCount({
      where: whereCondition,
      relations: ['counselor'],
      take: limit,
      skip: (page - 1) * limit,
      order: { appointmentDate: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      metaData: { 
        total,
        currentPage: page, 
        totalPages,
        limit 
      },
      data: appointments,
    };
  }

  async bookAppointment(bookAppointmentDto: BookAppointmentDto) {
    const { userId, counselorId, appointmentDate } = bookAppointmentDto;

    const requestedDate = new Date(appointmentDate);
    requestedDate.setSeconds(0, 0);
    requestedDate.setMilliseconds(0); 

    const [counselor, existingAppointmentForCounselor, existingAppointmentForUser] = 
    await Promise.all([
      this.counselorRepository.findOne({ where: { id: counselorId } }),
      this.appointmentRepository.findOne({
        where: {
          counselor: { id: counselorId },
          appointmentDate: requestedDate,
        },
      }),
      this.appointmentRepository.findOne({
        where: {
          userId,
          appointmentDate: requestedDate,
        },
      }),
    ]);

    if (!counselor) {
      throw new BadRequestException('Counselor not found');
    }

    if (existingAppointmentForCounselor) {
      throw new BadRequestException('This counselor is already booked at the selected time.');
    }

    if (existingAppointmentForUser) {
      throw new BadRequestException('This user already has an appointment at the selected time.');
    }

    const newAppointment = this.appointmentRepository.create({
      userId,
      appointmentDate: requestedDate, 
      counselor,
    });
    //add logic to send email/message to both parties here!
    return await this.appointmentRepository.save(newAppointment);
  }

  async getAvailableSlots(counselorId: number, date: string) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
          throw new BadRequestException('Invalid date format');
      }
      
      parsedDate.setHours(0, 0, 0, 0);
      
      // Checking if date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (parsedDate < today) {
          throw new BadRequestException('Cannot book appointments for past dates');
      }
      
      const counselor = await this.counselorRepository.findOne({
          where: { id: counselorId },
          select: ['workingDays', 'startTime', 'endTime'],
      });

      if (!counselor) {
          throw new BadRequestException('Counselor not found');
      }
      
      const workingDays = counselor.workingDays?.map(Number) ?? [1, 2, 3, 4, 5];

      const dayOfWeek = parsedDate.getDay() === 0 ? 7 : parsedDate.getDay();

      if (!workingDays.includes(dayOfWeek)) {
          return { message: 'Counselor is unavailable on this date', availableSlots: [] };
      }

      if (!counselor.startTime || !counselor.endTime) {
          throw new BadRequestException('Counselor working hours not set');
      }

      const startHour = parseInt(counselor.startTime.split(':')[0]);
      const endHour = parseInt(counselor.endTime.split(':')[0]);

      if (isNaN(startHour) || isNaN(endHour)) {
          throw new BadRequestException('Invalid working hours format');
      }

      // generating available slots for the selected day to be mapped on frontend
      const allSlots: string[] = [];
      for (let hour = startHour; hour < endHour; hour++) {
          const slot = new Date(parsedDate);
          slot.setHours(hour, 0, 0, 0);
          allSlots.push(slot.toISOString());
      }

      const startOfDay = new Date(parsedDate);
      const endOfDay = new Date(parsedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const bookedAppointments = await this.appointmentRepository.find({
          where: {
              counselor: { id: counselorId },
              appointmentDate: Between(startOfDay, endOfDay),
          },
          select: ['appointmentDate'],
      });

      const availableSlots = allSlots.filter(
          (slot) => !bookedAppointments.some((appt) => appt.appointmentDate.toISOString() === slot),
      );

      return {
          counselorId,
          date,
          availableSlots,
          message: availableSlots.length ? 'Available slots found' : 'No available slots for this date',
      };
  }
}
