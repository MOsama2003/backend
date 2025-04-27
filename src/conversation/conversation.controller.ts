import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { SendMessage } from './dto/create-message.dto';

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a new chat between users' })
  @ApiResponse({ status: 201, description: 'Chat initiated successfully' })
  async initiateChat(@Body() createConversationDto: CreateConversationDto, @Req() req: any) {
    return this.conversationService.initiateChat(createConversationDto, req);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get list of user conversations' })
  @ApiResponse({
    status: 200,
    description: 'List of chats returned successfully',
  })
  async chatListing(@Req() req: any, @Query() query: PaginationQueryDto) {
    return this.conversationService.chatListing(req, query);
  }

  @Post('send-message')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        conversationId: { type: 'string' },
        broadcastId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async sendMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new Error(
        'Body is undefined, ensure you are sending form-data correctly.',
      );
    }

    const sendMessage: SendMessage = {
      conversationId: body.conversationId,
      text: body.text,
      broadcastId: body.broadcastId
    };
    return this.conversationService.sendMessage(file, sendMessage, req);
  }

  @Get(':conversationId/messages')
  @ApiOperation({ summary: 'Get messages from a conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getMessages(
    @Param('conversationId') conversationId: number,
    @Req() req: any,
    @Query() query: PaginationQueryDto,
  ) {
    return this.conversationService.getMessages(conversationId, req, query);
  }

  @Patch(':conversationId/read-last-message/:messageId')
  @ApiOperation({ summary: 'Mark last message as seen' })
  @ApiResponse({ status: 200, description: 'Messages marked as seen' })
  async readLastMessage(
    @Req() req: any,
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: number,
  ) {
    return this.conversationService.readLastMessage(
      req,
      conversationId,
      messageId,
    );
  }

  @Patch(':conversationId/acknowledge-last-message/:messageId')
  @ApiOperation({ summary: 'Acknowledge last message' })
  @ApiResponse({ status: 200, description: 'Messages marked as seen' })
  async ackLastMessage(
    @Req() req: any,
    @Param('conversationId') conversationId: string,
    @Param('messageId') messageId: number,
  ) {
    return this.conversationService.acknowledgeLastMessage(
      req,
      conversationId,
      messageId,
    );
  }
}
