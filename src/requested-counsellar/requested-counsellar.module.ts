import { Module } from '@nestjs/common';
import { RequestedCounsellarService } from './requested-counsellar.service';
import { RequestedCounsellarController } from './requested-counsellar.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MailModule } from 'src/mail/mail.module';
import { RequestedCounsellar } from './entities/requested-counsellar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [RequestedCounsellarController],
  providers: [RequestedCounsellarService],
  imports: [TypeOrmModule.forFeature([RequestedCounsellar]), CloudinaryModule, MailModule],
  exports: [RequestedCounsellarService]
})
export class RequestedCounsellarModule {}
