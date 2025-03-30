import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultAiChatService } from './consult-ai-chat.service';
import { ConsultAiChatController } from './consult-ai-chat.controller';
import { RedisService } from '../redis/redis.service';
import { Message } from './entities/message.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [ConsultAiChatController],
  providers: [ConsultAiChatService, RedisService, CloudinaryService],
})
export class ConsultAiChatModule {}