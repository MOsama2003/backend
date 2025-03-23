import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { RequestedCounsellarModule } from 'src/requested-counsellar/requested-counsellar.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]),RequestedCounsellarModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}

