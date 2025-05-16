import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';
export declare class Appointment {
    id: number;
    userId: number;
    appointmentDate: Date;
    counselor: RequestedCounsellar;
}
