import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
export declare class ConversationController {
    private readonly conversationService;
    constructor(conversationService: ConversationService);
    initiateChat(createConversationDto: CreateConversationDto, req: any): Promise<import("./entities/conversation.entity").Conversation>;
    chatListing(req: any, query: PaginationQueryDto): Promise<{
        data: {
            conversationId: number;
            userId: number | null;
            userName: string;
            avatar: string | null;
            lastMessage: import("./entities/conversationMessages.entity").ConversationMessages | null;
            unreadCount: number;
        }[];
        totalChats: number;
        currentPage: number;
        totalPages: number;
    }>;
    sendMessage(file: Express.Multer.File, body: any, req: any): Promise<import("./entities/conversationMessages.entity").ConversationMessages>;
    getMessages(conversationId: number, req: any, query: PaginationQueryDto): Promise<{
        data: {
            messageId: number;
            text: string;
            file: string;
            sender: {
                id: number;
                name: string;
                avatar: string;
            };
            isRead: import("../constants").DeliveryStatus;
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
    ackLastMessage(req: any, conversationId: string, messageId: number): Promise<{
        message: string;
    }>;
}
