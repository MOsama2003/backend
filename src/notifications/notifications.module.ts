import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { FirebaseService } from './firebase.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, FirebaseService],
  imports: [TypeOrmModule.forFeature([Notification]), UserModule],
  exports: [FirebaseService]
})
export class NotificationsModule {}
