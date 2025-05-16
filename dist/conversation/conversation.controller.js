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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const conversation_service_1 = require("./conversation.service");
const create_conversation_dto_1 = require("./dto/create-conversation.dto");
const pagination_query_dto_1 = require("./dto/pagination-query.dto");
let ConversationController = class ConversationController {
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    async initiateChat(createConversationDto, req) {
        return this.conversationService.initiateChat(createConversationDto, req);
    }
    async chatListing(req, query) {
        return this.conversationService.chatListing(req, query);
    }
    async sendMessage(file, body, req) {
        if (!body || Object.keys(body).length === 0) {
            throw new Error('Body is undefined, ensure you are sending form-data correctly.');
        }
        const sendMessage = {
            conversationId: body.conversationId,
            text: body.text,
            broadcastId: body.broadcastId
        };
        return this.conversationService.sendMessage(file, sendMessage, req);
    }
    async getMessages(conversationId, req, query) {
        return this.conversationService.getMessages(conversationId, req, query);
    }
    async readLastMessage(req, conversationId, messageId) {
        return this.conversationService.readLastMessage(req, conversationId, messageId);
    }
    async ackLastMessage(req, conversationId, messageId) {
        return this.conversationService.acknowledgeLastMessage(req, conversationId, messageId);
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate a new chat between users' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat initiated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversation_dto_1.CreateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "initiateChat", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of user conversations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of chats returned successfully',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "chatListing", null);
__decorate([
    (0, common_1.Post)('send-message'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message in a conversation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)(':conversationId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages from a conversation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved successfully' }),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Patch)(':conversationId/read-last-message/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark last message as seen' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages marked as seen' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "readLastMessage", null);
__decorate([
    (0, common_1.Patch)(':conversationId/acknowledge-last-message/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Acknowledge last message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages marked as seen' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "ackLastMessage", null);
exports.ConversationController = ConversationController = __decorate([
    (0, swagger_1.ApiTags)('Conversations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('conversations'),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService])
], ConversationController);
//# sourceMappingURL=conversation.controller.js.map