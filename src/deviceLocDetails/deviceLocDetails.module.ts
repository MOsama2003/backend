import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { DeviceLocDetailsService } from './deviceLocDetails.service';
import { DeviceLocDetails } from './entities/deviceLocDetails.entity';
import { DeviceLocDetailsController } from './deviceLocDetails.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceLocDetails]), UserModule, NotificationsModule],
  controllers: [DeviceLocDetailsController],
  providers: [DeviceLocDetailsService],
})

export class DeviceLocDetailsModule {}
