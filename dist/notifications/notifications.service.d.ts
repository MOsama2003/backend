import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
export declare class NotificationsService {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    getAllNotifications(req: any, paginationQuery: PaginationQueryDto): Promise<{
        metaData: {
            totalCount: number;
            pageCount: number;
            page: number;
            take: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            itemCount: number;
            unreadCount: number;
        };
        data: Notification[];
    }>;
    getUnreadCount(req: any): Promise<number>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
