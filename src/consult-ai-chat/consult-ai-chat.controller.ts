import { 
  Controller, Post, Get, Delete, Body, Query, UploadedFile, 
  UseInterceptors, UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConsultAiChatService } from './consult-ai-chat.service';
import { 
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, 
  ApiQuery, ApiConsumes 
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('aichat')
@Controller('chat')
export class ConsultAiChatController {
  constructor(private readonly consultAiChatService: ConsultAiChatService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message (with or without an image) to the AI chat' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 21 },
        message: { type: 'string', example: 'Hello, I have issues with my crop, can you help?' },
        image: { type: 'string', format: 'binary', nullable: true }
      },
      required: ['userId', 'message']
    }
  })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async sendMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userId: number; message: string }
  ) {
    return this.consultAiChatService.sendMessage(body.userId, body.message, file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve chat messages for a user' })
  @ApiQuery({ name: 'userId', type: Number, required: true, example: 21 })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @Get('messages')
  getMessages(@Query('userId') userId: number, @Query('page') page?: number) {
    return this.consultAiChatService.getMessages(userId, page);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear chat history for a user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 21 }
      },
      required: ['userId']
    }
  })
  @ApiResponse({ status: 200, description: 'Chat cleared successfully' })
  @Delete('clear-chat')
  clearChat(@Body('userId') userId: number) {
    return this.consultAiChatService.clearChat(+userId);
  }
}
