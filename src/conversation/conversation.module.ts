import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { UserModule } from 'src/user/user.module';
import { ConversationMessages } from './entities/conversationMessages.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConversationGateway } from './conversation.gateway';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ConversationGateway],
  imports: [TypeOrmModule.forFeature([Conversation, ConversationMessages]), UserModule, CloudinaryModule, NotificationsModule]
})
export class ConversationModule {}
