import { User } from 'src/user/entities/user.entity';
export declare class Notification {
    id: number;
    user: User;
    title: string;
    body: string;
    data?: any;
    isRead: boolean;
    createdAt: Date;
}
