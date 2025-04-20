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
import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';
import { AuthModule } from 'src/auth/auth.module';
import { StreamModule } from 'src/stream/stream.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Reaction, Comment, RequestedCounsellar]), MailModule, CloudinaryModule, RequestedCounsellarModule, AuthModule, StreamModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
