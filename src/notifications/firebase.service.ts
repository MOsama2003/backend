import * as admin from 'firebase-admin';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    const keyPath = this.configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS_PATH',
    );
    if (!keyPath) {
      throw new Error('Firebase key path not configured');
    }

    const absolutePath = path.resolve(keyPath);
    const firebaseConfig = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));

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

    // Check if user and FCM token exist
    if (
      !user ||
      !user.fcmToken ||
      typeof user.fcmToken !== 'string' ||
      user.fcmToken.trim().length === 0
    ) {
      console.warn(`FCM token missing or invalid for user ID: ${userId}`);
      return;
    }

    const message = {
      token: user.fcmToken.trim(),
      android: {
        priority: 'high' as const,
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
      data: {
        title,
        body,
        ...data,
      },
      notification: { title, body }, // Optional: Remove this if app handles data manually
    };

    try {
      await admin.messaging().send(message);
      console.log('✅ Notification sent successfully');
    } catch (err) {
      console.error(`Error sending FCM to user ID ${userId}:`, err.message);
      // You might want to handle invalid token here (e.g., remove token if permanently invalid)
      return;
    }

    const notification = this.notificationRepository.create({
      title,
      body,
      user,
      isRead: false,
      createdAt: new Date(),
      data: data || {},
    });

    await this.notificationRepository.save(notification);
  }

  async subscribeToGlobalNotifications(fcmToken) {
    if (!fcmToken) {
      throw new BadRequestException('User does not have an FCM token.');
    }
    await admin
      .messaging()
      .subscribeToTopic([fcmToken], 'global_notifications');
  }

  async sendGlobalNotification(Notificationbody: CreateNotificationDto) {
    const { title, body, data } = Notificationbody;

    const message = {
      notification: { title, body },
      topic: 'global_notifications',
      data: data || {},
    };

    console.log('✅global Notification sent successfully');
    await admin.messaging().send(message);
  }

  async unsubscribeFromGlobalNotifications(fcmToken: string) {
    await admin
      .messaging()
      .unsubscribeFromTopic([fcmToken], 'global_notifications');
  }
}
