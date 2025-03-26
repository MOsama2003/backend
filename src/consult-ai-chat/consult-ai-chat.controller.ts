import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ConsultAiChatService } from './consult-ai-chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('test') 
@Controller('testChat')
export class ConsultAiChatController {
  constructor(private readonly consultAiChatService: ConsultAiChatService) {}

  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()
  @Get()
  @ApiQuery({ name: 'message', type: String, required: true }) // 🛠 Add this for Swagger UI
  testChat(@Request() req, @Query('message') message: string) {
    return this.consultAiChatService.getChatResponse(req.user.id, message);
  }
}
