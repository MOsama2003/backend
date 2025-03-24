import * as admin from 'firebase-admin';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}
  async onModuleInit() {
    const firebaseConfig = JSON.parse(
      this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS_JSON') || '{}',
    );    

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }

  async sendNotification(
    Notificationbody: CreateNotificationDto,
    userId: number,
  ) {
    const { body, title, data } = Notificationbody;
    const user = await this.userService.findByIdForNotification(+userId);

    if (!user || !user.fcmToken) {
      throw new BadRequestException('No User Exists!');
    }

    const message = {
      notification: { title, body },
      token: user.fcmToken,
      data: data || {},
    };

    await admin.messaging().send(message);

    const notification = this.notificationRepository.create({
      title,
      body,
      user,
      isRead: false,
      data: data || {},
    });

    await this.notificationRepository.save(notification);
  }

  async subscribeToGlobalNotifications(fcmToken) {
    if (!fcmToken) {
      throw new BadRequestException('User does not have an FCM token.');
    }
    await admin.messaging().subscribeToTopic(fcmToken, 'global_notifications');
  }

  async sendGlobalNotification(Notificationbody: CreateNotificationDto) {
    const { title, body, data } = Notificationbody;

    const message = {
      notification: { title, body },
      topic: 'global_notifications', 
      data: data || {},
    };

    await admin.messaging().send(message);
  }
}
