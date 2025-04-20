import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { FirebaseService } from './firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, FirebaseService],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    forwardRef(() => UserModule),
  ],
  exports: [FirebaseService],
})
export class NotificationsModule {}
