import { NotificationsService } from './notifications.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
        data: import("./entities/notification.entity").Notification[];
    }>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
