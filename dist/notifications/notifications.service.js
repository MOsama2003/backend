"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const typeorm_2 = require("@nestjs/typeorm");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async getAllNotifications(req, paginationQuery) {
        const { page = 1, limit = 10, search = '' } = paginationQuery;
        try {
            const currentPage = Math.max(1, page);
            const take = Math.max(1, limit);
            const skip = Number((currentPage - 1) * take);
            const [notifications, total] = await this.notificationRepository.findAndCount({
                where: [
                    {
                        user: { id: req.user.id },
                    }
                ],
                order: { createdAt: 'DESC' },
                skip,
                take,
                select: [
                    'id',
                    'title',
                    'body',
                    'data',
                    'isRead',
                    'createdAt',
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
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
            throw new common_1.InternalServerErrorException('Something went wrong while fetching notifications.');
        }
    }
    async getUnreadCount(req) {
        return await this.notificationRepository.count({
            where: {
                user: { id: req.user.id },
                isRead: false
            }
        });
    }
    async markAllAsRead(req) {
        await this.notificationRepository.update({
            user: { id: req.user.id },
            isRead: false
        }, { isRead: true });
        return { success: true, message: 'All notifications marked as read' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map