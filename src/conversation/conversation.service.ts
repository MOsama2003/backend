import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ConversationMessages } from './entities/conversationMessages.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SendMessage } from './dto/create-message.dto';
import { DeliveryStatus } from 'src/constants';
import { ConversationGateway } from './conversation.gateway';
import { FirebaseService } from 'src/notifications/firebase.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationMessages)
    private readonly messagesRepository: Repository<ConversationMessages>,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly chatGateway: ConversationGateway,
    private readonly notificationService: FirebaseService,
  ) {}

  async initiateChat(data: CreateConversationDto, req: any) {
    const { userIds } = data;

    if (userIds.length !== 1) {
      throw new BadRequestException(
        'Exactly one userId must be provided to initiate a chat.',
      );
    }

    const otherUserId = userIds[0];
    const otherUser = await this.userService.findById(otherUserId);
    if (!otherUser) {
      throw new NotFoundException('User not found.');
    }

    const loggedInUserId = req.user.id;

    // Step 1: Check if conversation already exists between these two users
    const existingChat = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin(
        'conversation.conversationParticipants',
        'participant1',
        'participant1.id = :loggedInUserId',
        { loggedInUserId },
      )
      .innerJoin(
        'conversation.conversationParticipants',
        'participant2',
        'participant2.id = :otherUserId',
        { otherUserId },
      )
      .getOne();

    if (existingChat) {
      return existingChat;
    }

    // Step 2: Create a new conversation if not exists
    const newChat = this.conversationRepository.create({
      conversationParticipants: [
        { id: loggedInUserId } as any,
        { id: otherUserId } as any,
      ],
    });

    await this.notificationService.sendNotification(
      {
        title: 'New Chat Initiated',
        body: `${req.user.name} added you`,
        data: { chatId: String(newChat.conversationtId) },
      },
      +otherUserId,
    );

    return await this.conversationRepository.save(newChat);
  }
  async chatListing(req: any, data: PaginationQueryDto) {
    const { limit = 10, page = 1 } = data;
    const userId = req.user.id;

    // First, get all conversation IDs where the user is a participant
    const qb = this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin(
        'conversation.conversationParticipants',
        'participant',
        'participant.id = :userId',
        { userId },
      )
      .leftJoinAndSelect(
        'conversation.conversationParticipants',
        'participants',
      )
      .leftJoinAndSelect('conversation.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender')
      .orderBy('conversation.createdAt', 'DESC') // Order by conversation's creation time
      .skip((page - 1) * limit)
      .take(limit);

    const [conversations, total] = await qb.getManyAndCount();

    const chatList = conversations.map((conversation) => {
      // Find the other user in the conversation
      const otherUser = conversation.conversationParticipants.find(
        (user) => user.id !== userId,
      );

      // Get the last message, sorted by creation time
      const lastMessage =
        conversation.messages && conversation.messages.length > 0
          ? conversation.messages.sort(
              (m1, m2) => m2.createdAt.getTime() - m1.createdAt.getTime(),
            )[0]
          : null;

      // Count unread messages (ones delivered but not from the current user)
      const unreadCount = conversation.messages
        ? conversation.messages.filter(
            (msg) =>
              msg.status === DeliveryStatus.DELIVER &&
              msg.sender?.id !== userId,
          ).length
        : 0;

      return {
        conversationId: conversation.conversationtId, // Using the actual property name from the entity
        userId: otherUser?.id || null,
        userName: otherUser
          ? `${otherUser.firstName} ${otherUser.lastName}`
          : 'Unknown',
        avatar: otherUser?.avatar || null,
        lastMessage,
        unreadCount,
      };
    });

    return {
      data: chatList,
      totalChats: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async sendMessage(
    @UploadedFile() file: Express.Multer.File,
    sendMessageDto: SendMessage,
    req: any,
  ) {
    const { text, conversationId, broadcastId } = sendMessageDto;
    let fileToSend = '';

    if (file) {
      const uploadedFile = await this.cloudinaryService.uploadFile(file);
      if (!uploadedFile) {
        throw new BadRequestException('File upload failed');
      }
      fileToSend = uploadedFile.url;
    }

    const conversation = await this.conversationRepository.findOne({
      where: { conversationtId: Number(conversationId) },
      relations: ['conversationParticipants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.messagesRepository.create({
      sender: req.user,
      text: text,
      file: fileToSend,
      status: DeliveryStatus.SEND,
      conversation,
      broadcastId,
      createdAt: new Date(),
    });

    const savedMessage = await this.messagesRepository.save(message);

    await this.chatGateway.sendMessageToRoom({
      conversationId: savedMessage.conversation.conversationtId,
      message: savedMessage,
    });

    const participantIds = conversation.conversationParticipants.map(
      (p) => p.id,
    );

    this.chatGateway.sendConversationUpdate({
      participants: participantIds,
      conversationId,
      lastMessage: savedMessage, // Send the latest message details
    });

    return savedMessage;
  }

  async getMessages(
    conversationId: number,
    req: any,
    paginationDto: PaginationQueryDto,
  ) {
    const { limit = 10, page = 1 } = paginationDto;
    const userId = req.user.id;

    const conversation = await this.conversationRepository.findOne({
      where: { conversationtId: conversationId },
      relations: ['conversationParticipants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant = conversation.conversationParticipants.some(
      (user) => user.id === userId,
    );

    if (!isParticipant) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    await this.messagesRepository.update(
      {
        conversation: { conversationtId: conversationId },
        sender: { id: Not(userId) },
        status: In([DeliveryStatus.DELIVER, DeliveryStatus.SEND]),
      },
      { status: DeliveryStatus.SEEN },
    );

    const [messages, totalMessages] =
      await this.messagesRepository.findAndCount({
        where: { conversation: { conversationtId: conversationId } },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
        relations: ['sender'],
      });

    return {
      data: messages.map((msg) => ({
        messageId: msg.messageId,
        text: msg.text,
        file: msg.file,
        sender: {
          id: msg.sender.id,
          name: `${msg.sender.firstName} ${msg.sender.lastName}`,
          avatar: msg.sender.avatar,
        },
        isRead: msg.status,
        createdAt: msg.createdAt,
        broadcastId: msg.broadcastId,
      })),
      totalMessages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
    };
  }

  async readLastMessage(req: any, conversationId: string, messageId: number) {
    const userId = req.user.id;

    const message = await this.messagesRepository.findOne({
      where: {
        messageId: messageId,
        sender: { id: Not(userId) },
        conversation: { conversationtId: Number(conversationId) },
      },
      relations: ['conversation', 'sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found or not from another user');
    }

    await this.messagesRepository.update(
      {
        conversation: { conversationtId: Number(conversationId) },
        sender: { id: Not(userId) },
        status: DeliveryStatus.DELIVER,
        createdAt: MoreThanOrEqual(message.createdAt),
      },
      { status: DeliveryStatus.SEEN },
    );

    await this.chatGateway.sendConversationMessageUpdate({
      receiverId: message.sender.id.toString(),
      message: {
        text: message.text,
        user: message.sender,
        messageId: message.messageId,
        status: DeliveryStatus.SEEN,
      },
    });

    return { message: 'Messages marked as seen' };
  }

  async acknowledgeLastMessage(
    req: any,
    conversationId: string,
    messageId: number,
  ) {
    const message = await this.messagesRepository.findOne({
      where: {
        messageId,
        sender: { id: Not(req.user.id) },
        conversation: { conversationtId: Number(conversationId) },
        status: DeliveryStatus.SEND,
      },
      relations: ['sender'],
    });

    if (!message) {
      return { message: 'No message found to acknowledge' };
    }

    message.status = DeliveryStatus.DELIVER;
    await this.messagesRepository.save(message);

    await this.chatGateway.sendConversationMessageUpdate({
      receiverId: message.sender.id.toString(),
      message: {
        text: message.text,
        user: message.sender,
        messageId: message.messageId,
        status: DeliveryStatus.DELIVER,
      },
    });

    return { message: 'Message marked as delivered' };
  }
}
