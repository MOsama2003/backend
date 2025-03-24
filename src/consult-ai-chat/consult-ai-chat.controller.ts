import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConsultAiChatService } from './consult-ai-chat.service';

@ApiTags('test') 
@Controller('testChat')
export class ConsultAiChatController {
  constructor(private readonly consultAiChatService: ConsultAiChatService) {}

  @Get('test')
  testChat() {
    return { message: 'Chat API is working!' };
  }
}
