import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async getAllNotifications(req: any, paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10, search = '' } = paginationQuery;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const searchFilters = search
        ? [
            { title: ILike(`%${search}%`) },
            { body: ILike(`%${search}%`) },
          ]
        : [];

      const [notifications, total] = await this.notificationRepository.findAndCount({
        where: [
          { 
            user: { id: req.user.id },
            ...(searchFilters.length ? { $or: searchFilters } : {})
          }
        ],
        order: { createdAt: 'DESC' },
        skip,
        take,
        relations: ['user'],
        select: [
          'id',
          'title',
          'body',
          'data',
          'isRead',
          'createdAt',
          'user'
        ]
      });

      const pageCount = Math.ceil(total / take);
      const hasNextPage = currentPage < pageCount;
      const hasPrevPage = currentPage > 1;

      return {
        metaData: {
          totalCount: total,
          pageCount,
          page: currentPage,
          take,
          hasNextPage,
          hasPrevPage,
          itemCount: notifications.length,
          unreadCount: await this.getUnreadCount(req)
        },
        data: notifications,
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching notifications.',
      );
    }
  }

  async getUnreadCount(req: any) {
    return await this.notificationRepository.count({
      where: { 
        user: { id: req.user.id },
        isRead: false 
      }
    });
  }

  async markAllAsRead(req: any) {
    await this.notificationRepository.update(
      { 
        user: { id: req.user.id },
        isRead: false 
      },
      { isRead: true }
    );
    
    return { success: true, message: 'All notifications marked as read' };
  }
}