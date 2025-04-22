import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { DeviceLocDetailsService } from './deviceLocDetails.service';
import { DeviceLocDetails } from './entities/deviceLocDetails.entity';
import { DeviceLocDetailsController } from './deviceLocDetails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceLocDetails]), UserModule],
  controllers: [DeviceLocDetailsController],
  providers: [DeviceLocDetailsService],
})

export class DeviceLocDetailsModule {}
