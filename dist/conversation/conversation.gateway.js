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
exports.ConversationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let ConversationGateway = class ConversationGateway {
    constructor() {
        this.activeUsers = new Map();
    }
    handleConnection(socket) {
        const userId = socket.handshake.query.userId;
        if (userId) {
            this.activeUsers.set(userId, socket.id);
            console.log(`User ${userId} connected`);
        }
    }
    handleDisconnect(socket) {
        for (const [userId, socketId] of this.activeUsers.entries()) {
            if (socketId === socket.id) {
                this.activeUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
    }
    handleJoinRoom(data, socket) {
        socket.join(`chat_${data.conversationId}`);
    }
    handleLeaveRoom(data, socket) {
        socket.leave(`chat_${data.conversationId}`);
    }
    sendMessageToRoom({ conversationId, message }) {
        this.server.to(`chat_${conversationId}`).emit('newMessage', message);
        console.log(`Broadcasting message to chat_${conversationId}:`, message);
    }
    sendConversationUpdate({ participants, conversationId, lastMessage }) {
        participants.forEach((userId) => {
            const socketId = this.activeUsers.get(userId);
            if (socketId) {
                this.server.to(socketId).emit('conversationUpdate', {
                    conversationId,
                    lastMessage,
                });
            }
        });
        console.log(`Broadcasting conversation update for ${conversationId}`);
    }
    sendConversationMessageUpdate({ receiverId, message }) {
        this.server.to(receiverId).emit('conversationMessageUpdate', {
            message,
        });
        console.log(`conversationMessageUpdate sent to sender ${receiverId}:`, {
            message,
        });
    }
};
exports.ConversationGateway = ConversationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ConversationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ConversationGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ConversationGateway.prototype, "handleLeaveRoom", null);
exports.ConversationGateway = ConversationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } })
], ConversationGateway);
//# sourceMappingURL=conversation.gateway.js.map