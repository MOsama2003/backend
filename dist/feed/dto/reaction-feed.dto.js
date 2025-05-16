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
exports.CreateReactionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const constants_1 = require("../../constants");
class CreateReactionDto {
}
exports.CreateReactionDto = CreateReactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the post to react to',
        example: '123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateReactionDto.prototype, "postId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of reaction (Upvote or Devote)',
        enum: constants_1.PostReaction,
        example: constants_1.PostReaction.Upvote,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(constants_1.PostReaction),
    __metadata("design:type", String)
], CreateReactionDto.prototype, "reactionType", void 0);
//# sourceMappingURL=reaction-feed.dto.js.map