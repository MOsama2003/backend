import { Controller, Get, Post, Req, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated notifications with search' })
  @ApiResponse({ status: 200, description: 'Paginated notifications with metadata' })
  async getAllNotifications(
    @Req() req,
    @Query() paginationQuery: PaginationQueryDto
  ) {
    return this.notificationsService.getAllNotifications(req, paginationQuery);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get count of unread notifications' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(@Req() req) {
    return { count: await this.notificationsService.getUnreadCount(req) };
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'Success message' })
  async markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req);
  }
}