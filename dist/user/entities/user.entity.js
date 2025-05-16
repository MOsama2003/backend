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
exports.User = void 0;
const class_validator_1 = require("class-validator");
const blog_entity_1 = require("../../blog/entities/blog.entity");
const message_entity_1 = require("../../consult-ai-chat/entities/message.entity");
const farm_entity_1 = require("../../farm-task-advisory/entities/farm.entity");
const comment_entity_1 = require("../../feed/entities/comment.entity");
const feed_entity_1 = require("../../feed/entities/feed.entity");
const reaction_entity_1 = require("../../feed/entities/reaction.entity");
const notification_entity_1 = require("../../notifications/entities/notification.entity");
const requested_counsellar_entity_1 = require("../../requested-counsellar/entities/requested-counsellar.entity");
const typeorm_1 = require("typeorm");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "disabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "fcmToken", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => blog_entity_1.Blog, (article) => article.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => feed_entity_1.Feed, (feed) => feed.publisher, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "feed", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reaction_entity_1.Reaction, (reaction) => reaction.user),
    __metadata("design:type", Array)
], User.prototype, "reactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.commentAuthor, {
        cascade: true,
    }),
    __metadata("design:type", comment_entity_1.Comment)
], User.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.user),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => requested_counsellar_entity_1.RequestedCounsellar, (counsellor) => counsellor.user),
    __metadata("design:type", requested_counsellar_entity_1.RequestedCounsellar)
], User.prototype, "counsellorProfile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => farm_entity_1.Farm, (farm) => farm.user),
    __metadata("design:type", Array)
], User.prototype, "farms", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map