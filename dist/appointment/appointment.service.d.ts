import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { BookAppointmentDto } from './dto/book-appointments.dto';
import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';
export declare class AppointmentService {
    private readonly appointmentRepository;
    private readonly counselorRepository;
    constructor(appointmentRepository: Repository<Appointment>, counselorRepository: Repository<RequestedCounsellar>);
    getAppointmentsOfCounselor(counselorId: number, paginationQuery: PaginationQueryDto): Promise<{
        metaData: {
            total: number;
            currentPage: number;
            totalPages: number;
            limit: number;
        };
        data: Appointment[];
    }>;
    getAppointmentsOfUser(userId: number, paginationQuery: PaginationQueryDto): Promise<{
        metaData: {
            total: number;
            currentPage: number;
            totalPages: number;
            limit: number;
        };
        data: Appointment[];
    }>;
    bookAppointment(bookAppointmentDto: BookAppointmentDto): Promise<Appointment>;
    getAvailableSlots(counselorId: number, date: string): Promise<{
        message: string;
        availableSlots: never[];
        counselorId?: undefined;
        date?: undefined;
    } | {
        counselorId: number;
        date: string;
        availableSlots: string[];
        message: string;
    }>;
}
