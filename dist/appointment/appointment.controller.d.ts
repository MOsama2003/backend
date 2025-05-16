import { AppointmentService } from './appointment.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { BookAppointmentDto } from './dto/book-appointments.dto';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
export declare class AppointmentController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentService);
    getAppointmentsOfCounselor(req: any, paginationQuery: PaginationQueryDto): Promise<{
        metaData: {
            total: number;
            currentPage: number;
            totalPages: number;
            limit: number;
        };
        data: import("./entities/appointment.entity").Appointment[];
    }>;
    getAppointmentsOfUser(req: any, paginationQuery: PaginationQueryDto): Promise<{
        metaData: {
            total: number;
            currentPage: number;
            totalPages: number;
            limit: number;
        };
        data: import("./entities/appointment.entity").Appointment[];
    }>;
    bookAppointment(req: any, bookAppointmentDto: BookAppointmentDto): Promise<import("./entities/appointment.entity").Appointment>;
    getAvailableSlots(query: AvailabilityQueryDto): Promise<{
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
