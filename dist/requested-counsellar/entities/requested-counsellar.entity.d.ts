import { Appointment } from 'src/appointment/entities/appointment.entity';
import { User } from 'src/user/entities/user.entity';
export declare class RequestedCounsellar {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    resume: string;
    yoe: string;
    expertise: string;
    workingDays: number[];
    startTime: string;
    endTime: string;
    isApproved: boolean;
    user: User;
    appointments: Appointment[];
}
