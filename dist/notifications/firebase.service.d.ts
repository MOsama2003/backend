import { OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { ConfigService } from '@nestjs/config';
export declare class FirebaseService implements OnModuleInit {
    private readonly configService;
    private readonly notificationRepository;
    private readonly userService;
    constructor(configService: ConfigService, notificationRepository: Repository<Notification>, userService: UserService);
    onModuleInit(): Promise<void>;
    sendNotification(Notificationbody: CreateNotificationDto, userId: number): Promise<void>;
    subscribeToGlobalNotifications(fcmToken: any): Promise<void>;
    sendGlobalNotification(Notificationbody: CreateNotificationDto): Promise<void>;
    unsubscribeFromGlobalNotifications(fcmToken: string): Promise<void>;
}
