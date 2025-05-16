import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ConversationMessages } from './entities/conversationMessages.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { SendMessage } from './dto/create-message.dto';
import { DeliveryStatus } from 'src/constants';
import { ConversationGateway } from './conversation.gateway';
import { FirebaseService } from 'src/notifications/firebase.service';
export declare class ConversationService {
    private readonly conversationRepository;
    private readonly messagesRepository;
    private readonly userService;
    private readonly cloudinaryService;
    private readonly chatGateway;
    private readonly notificationService;
    constructor(conversationRepository: Repository<Conversation>, messagesRepository: Repository<ConversationMessages>, userService: UserService, cloudinaryService: CloudinaryService, chatGateway: ConversationGateway, notificationService: FirebaseService);
    initiateChat(data: CreateConversationDto, req: any): Promise<Conversation>;
    chatListing(req: any, data: PaginationQueryDto): Promise<{
        data: {
            conversationId: number;
            userId: number | null;
            userName: string;
            avatar: string | null;
            lastMessage: ConversationMessages | null;
            unreadCount: number;
        }[];
        totalChats: number;
        currentPage: number;
        totalPages: number;
    }>;
    sendMessage(file: Express.Multer.File, sendMessageDto: SendMessage, req: any): Promise<ConversationMessages>;
    getMessages(conversationId: number, req: any, paginationDto: PaginationQueryDto): Promise<{
        data: {
            messageId: number;
            text: string;
            file: string;
            sender: {
                id: number;
                name: string;
                avatar: string;
            };
            isRead: DeliveryStatus;
            createdAt: Date;
            broadcastId: string;
        }[];
        totalMessages: number;
        currentPage: number;
        totalPages: number;
    }>;
    readLastMessage(req: any, conversationId: string, messageId: number): Promise<{
        message: string;
    }>;
    acknowledgeLastMessage(req: any, conversationId: string, messageId: number): Promise<{
        message: string;
    }>;
}
