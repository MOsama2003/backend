import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RequestedCounsellarModule } from 'src/requested-counsellar/requested-counsellar.module';
import { Reaction } from 'src/feed/entities/reaction.entity';
import { Comment } from 'src/feed/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Reaction, Comment]), MailModule, CloudinaryModule, RequestedCounsellarModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
