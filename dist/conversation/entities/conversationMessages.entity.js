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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationMessages = void 0;
const constants_1 = require("../../constants");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const conversation_entity_1 = require("./conversation.entity");
let ConversationMessages = class ConversationMessages {
};
exports.ConversationMessages = ConversationMessages;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ConversationMessages.prototype, "messageId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_entity_1.Conversation, (chat) => chat.messages),
    __metadata("design:type", conversation_entity_1.Conversation)
], ConversationMessages.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ConversationMessages.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ConversationMessages.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ConversationMessages.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: constants_1.DeliveryStatus, default: constants_1.DeliveryStatus.SEND }),
    __metadata("design:type", String)
], ConversationMessages.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ConversationMessages.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ConversationMessages.prototype, "broadcastId", void 0);
exports.ConversationMessages = ConversationMessages = __decorate([
    (0, typeorm_1.Entity)()
], ConversationMessages);
//# sourceMappingURL=conversationMessages.entity.js.map