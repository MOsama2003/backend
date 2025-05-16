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
exports.ConsultAiChatController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const consult_ai_chat_service_1 = require("./consult-ai-chat.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
let ConsultAiChatController = class ConsultAiChatController {
    constructor(consultAiChatService) {
        this.consultAiChatService = consultAiChatService;
    }
    async sendMessage(file, body) {
        return this.consultAiChatService.sendMessage(body.userId, body.message, file);
    }
    getMessages(userId, page) {
        return this.consultAiChatService.getMessages(userId, page);
    }
    clearChat(userId) {
        return this.consultAiChatService.clearChat(+userId);
    }
};
exports.ConsultAiChatController = ConsultAiChatController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message (with or without an image) to the AI chat' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number', example: 21 },
                message: { type: 'string', example: 'Hello, I have issues with my crop, can you help?' },
                image: { type: 'string', format: 'binary', nullable: true }
            },
            required: ['userId', 'message']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully' }),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConsultAiChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve chat messages for a user' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', type: Number, required: true, example: 21 }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved successfully' }),
    (0, common_1.Get)('messages'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ConsultAiChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear chat history for a user' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number', example: 21 }
            },
            required: ['userId']
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat cleared successfully' }),
    (0, common_1.Delete)('clear-chat'),
    __param(0, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ConsultAiChatController.prototype, "clearChat", null);
exports.ConsultAiChatController = ConsultAiChatController = __decorate([
    (0, swagger_1.ApiTags)('aichat'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [consult_ai_chat_service_1.ConsultAiChatService])
], ConsultAiChatController);
//# sourceMappingURL=consult-ai-chat.controller.js.map