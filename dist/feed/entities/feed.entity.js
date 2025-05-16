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
exports.Feed = void 0;
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const reaction_entity_1 = require("./reaction.entity");
const comment_entity_1 = require("./comment.entity");
let Feed = class Feed {
};
exports.Feed = Feed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Feed.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true, nullable: true }),
    __metadata("design:type", Array)
], Feed.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Feed.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Feed.prototype, "publishedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.feed, { onDelete: "CASCADE" }),
    __metadata("design:type", user_entity_1.User)
], Feed.prototype, "publisher", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reaction_entity_1.Reaction, (reaction) => reaction.post, { cascade: true }),
    __metadata("design:type", Array)
], Feed.prototype, "reaction", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.post, { cascade: true }),
    __metadata("design:type", Array)
], Feed.prototype, "comment", void 0);
exports.Feed = Feed = __decorate([
    (0, typeorm_1.Entity)()
], Feed);
//# sourceMappingURL=feed.entity.js.map