"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const conversation_entity_1 = require("./entities/conversation.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../user/user.service");
const conversationMessages_entity_1 = require("./entities/conversationMessages.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const constants_1 = require("../constants");
const conversation_gateway_1 = require("./conversation.gateway");
const firebase_service_1 = require("../notifications/firebase.service");
let ConversationService = class ConversationService {
    constructor(conversationRepository, messagesRepository, userService, cloudinaryService, chatGateway, notificationService) {
        this.conversationRepository = conversationRepository;
        this.messagesRepository = messagesRepository;
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
        this.chatGateway = chatGateway;
        this.notificationService = notificationService;
    }
    async initiateChat(data, req) {
        const { userIds } = data;
        if (userIds.length !== 1) {
            throw new common_1.BadRequestException('Exactly one userId must be provided to initiate a chat.');
        }
        const otherUserId = userIds[0];
        const otherUser = await this.userService.findById(otherUserId);
        if (!otherUser) {
            throw new common_1.NotFoundException('User not found.');
        }
        const loggedInUserId = req.user.id;
        const existingChat = await this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.conversationParticipants', 'participant1', 'participant1.id = :loggedInUserId', { loggedInUserId })
            .innerJoin('conversation.conversationParticipants', 'participant2', 'participant2.id = :otherUserId', { otherUserId })
            .getOne();
        if (existingChat) {
            return existingChat;
        }
        const newChat = this.conversationRepository.create({
            conversationParticipants: [
                { id: loggedInUserId },
                { id: otherUserId },
            ],
        });
        await this.notificationService.sendNotification({
            title: 'New Chat Initiated',
            body: `${req.user.name} added you`,
            data: { chatId: String(newChat.conversationtId) },
        }, +otherUserId);
        return await this.conversationRepository.save(newChat);
    }
    async chatListing(req, data) {
        const { limit = 10, page = 1 } = data;
        const userId = req.user.id;
        const qb = this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.conversationParticipants', 'participant', 'participant.id = :userId', { userId })
            .leftJoinAndSelect('conversation.conversationParticipants', 'participants')
            .leftJoinAndSelect('conversation.messages', 'messages')
            .leftJoinAndSelect('messages.sender', 'sender')
            .orderBy('conversation.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [conversations, total] = await qb.getManyAndCount();
        const chatList = conversations.map((conversation) => {
            const otherUser = conversation.conversationParticipants.find((user) => user.id !== userId);
            const lastMessage = conversation.messages && conversation.messages.length > 0
                ? conversation.messages.sort((m1, m2) => m2.createdAt.getTime() - m1.createdAt.getTime())[0]
                : null;
            const unreadCount = conversation.messages
                ? conversation.messages.filter((msg) => msg.status === constants_1.DeliveryStatus.DELIVER &&
                    msg.sender?.id !== userId).length
                : 0;
            return {
                conversationId: conversation.conversationtId,
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
    async sendMessage(file, sendMessageDto, req) {
        const { text, conversationId, broadcastId } = sendMessageDto;
        let fileToSend = '';
        if (file) {
            const uploadedFile = await this.cloudinaryService.uploadFile(file);
            if (!uploadedFile) {
                throw new common_1.BadRequestException('File upload failed');
            }
            fileToSend = uploadedFile.url;
        }
        const conversation = await this.conversationRepository.findOne({
            where: { conversationtId: Number(conversationId) },
            relations: ['conversationParticipants'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const message = await this.messagesRepository.create({
            sender: req.user,
            text: text,
            file: fileToSend,
            status: constants_1.DeliveryStatus.SEND,
            conversation,
            broadcastId,
            createdAt: new Date(),
        });
        const savedMessage = await this.messagesRepository.save(message);
        await this.chatGateway.sendMessageToRoom({
            conversationId: savedMessage.conversation.conversationtId,
            message: savedMessage,
        });
        const participantIds = conversation.conversationParticipants.map((p) => p.id);
        this.chatGateway.sendConversationUpdate({
            participants: participantIds,
            conversationId,
            lastMessage: savedMessage,
        });
        return savedMessage;
    }
    async getMessages(conversationId, req, paginationDto) {
        const { limit = 10, page = 1 } = paginationDto;
        const userId = req.user.id;
        const conversation = await this.conversationRepository.findOne({
            where: { conversationtId: conversationId },
            relations: ['conversationParticipants'],
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isParticipant = conversation.conversationParticipants.some((user) => user.id === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not part of this conversation');
        }
        await this.messagesRepository.update({
            conversation: { conversationtId: conversationId },
            sender: { id: (0, typeorm_2.Not)(userId) },
            status: (0, typeorm_2.In)([constants_1.DeliveryStatus.DELIVER, constants_1.DeliveryStatus.SEND]),
        }, { status: constants_1.DeliveryStatus.SEEN });
        const [messages, totalMessages] = await this.messagesRepository.findAndCount({
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
    async readLastMessage(req, conversationId, messageId) {
        const userId = req.user.id;
        const message = await this.messagesRepository.findOne({
            where: {
                messageId: messageId,
                sender: { id: (0, typeorm_2.Not)(userId) },
                conversation: { conversationtId: Number(conversationId) },
            },
            relations: ['conversation', 'sender'],
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found or not from another user');
        }
        await this.messagesRepository.update({
            conversation: { conversationtId: Number(conversationId) },
            sender: { id: (0, typeorm_2.Not)(userId) },
            status: constants_1.DeliveryStatus.DELIVER,
            createdAt: (0, typeorm_2.MoreThanOrEqual)(message.createdAt),
        }, { status: constants_1.DeliveryStatus.SEEN });
        await this.chatGateway.sendConversationMessageUpdate({
            receiverId: message.sender.id.toString(),
            message: {
                text: message.text,
                user: message.sender,
                messageId: message.messageId,
                status: constants_1.DeliveryStatus.SEEN,
            },
        });
        return { message: 'Messages marked as seen' };
    }
    async acknowledgeLastMessage(req, conversationId, messageId) {
        const message = await this.messagesRepository.findOne({
            where: {
                messageId,
                sender: { id: (0, typeorm_2.Not)(req.user.id) },
                conversation: { conversationtId: Number(conversationId) },
                status: constants_1.DeliveryStatus.SEND,
            },
            relations: ['sender'],
        });
        if (!message) {
            return { message: 'No message found to acknowledge' };
        }
        message.status = constants_1.DeliveryStatus.DELIVER;
        await this.messagesRepository.save(message);
        await this.chatGateway.sendConversationMessageUpdate({
            receiverId: message.sender.id.toString(),
            message: {
                text: message.text,
                user: message.sender,
                messageId: message.messageId,
                status: constants_1.DeliveryStatus.DELIVER,
            },
        });
        return { message: 'Message marked as delivered' };
    }
};
exports.ConversationService = ConversationService;
__decorate([
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.SendMessage, Object]),
    __metadata("design:returntype", Promise)
], ConversationService.prototype, "sendMessage", null);
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(conversationMessages_entity_1.ConversationMessages)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        cloudinary_service_1.CloudinaryService,
        conversation_gateway_1.ConversationGateway,
        firebase_service_1.FirebaseService])
], ConversationService);
//# sourceMappingURL=conversation.service.js.map