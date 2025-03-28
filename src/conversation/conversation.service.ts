import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ConversationMessages } from './entities/conversationMessages.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationMessages)
    private readonly messagesRepository: Repository<ConversationMessages>,
    private readonly userService: UserService,
  ) {}

  async initiateChat(data: CreateConversationDto): Promise<Conversation> {
    const { userIds } = data;
    if (userIds.length < 2) {
      throw new BadRequestException('At least two participants are required.');
    }

    const users = await this.userService.findUserByIds(userIds);
    if (users.length !== userIds.length) {
      throw new NotFoundException('Some users not found.');
    }

    const possibleChats = await this.conversationRepository.find({
      where: {
        conversationParticipants: { id: userIds[0] },
      },
      relations: ['conversationParticipants'],
    });

    const existingChat = possibleChats.find(
      (chat) =>
        chat.conversationParticipants.length === users.length &&
        chat.conversationParticipants.every((user) =>
          userIds.includes(user.id),
        ),
    );

    if (existingChat) return existingChat;

    const newChat = this.conversationRepository.create({
      conversationParticipants: users,
    });

    return this.conversationRepository.save(newChat);
  }

  async chatListing(req: any, data: PaginationQueryDto) {
    const { limit = 10, page = 1 } = data;
    const userId = req.user.id;

    const [conversations, total] =
      await this.conversationRepository.findAndCount({
        where: { conversationParticipants: { id: userId } },
        relations: ['conversationParticipants', 'messages'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      });

    const chatList = conversations.map((conversation) => {
      const participants = conversation.conversationParticipants.filter(
        (user) => user.id !== userId,
      );

      const otherUser = participants[0];

      const lastMessage = conversation.messages.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0];

      const unreadCount = conversation.messages.filter(
        (msg) => !msg.isRead && msg.sender.id !== userId,
      ).length;

      return {
        userId: otherUser?.id || null,
        userName: otherUser?.firstName + ' ' + otherUser?.lastName || 'Unknown',
        avatar: otherUser?.avatar || null,
        lastMessage: lastMessage?.text || 'No messages yet',
        lastMessageTime: lastMessage?.createdAt || null,
        unreadCount: unreadCount,
      };
    });

    return {
      data: chatList,
      totalChats: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  
}
