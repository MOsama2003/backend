import { Module } from '@nestjs/common';
import { ConsultAiChatService } from './consult-ai-chat.service';
import { RedisModule } from 'src/redis/redis.module';
import { ConsultAiChatController } from './consult-ai-chat.controller';

@Module({
  imports: [RedisModule], // 👈 Make sure RedisModule is imported
  providers: [ConsultAiChatService],
  controllers: [ConsultAiChatController],
  exports: [ConsultAiChatService],
})
export class ConsultAiChatModule {}
