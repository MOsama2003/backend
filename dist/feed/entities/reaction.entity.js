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
exports.Reaction = void 0;
const constants_1 = require("../../constants");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
const feed_entity_1 = require("./feed.entity");
let Reaction = class Reaction {
};
exports.Reaction = Reaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.PostReaction }),
    __metadata("design:type", String)
], Reaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reactions, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Reaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => feed_entity_1.Feed, (feed) => feed.reaction, { onDelete: 'CASCADE' }),
    __metadata("design:type", feed_entity_1.Feed)
], Reaction.prototype, "post", void 0);
exports.Reaction = Reaction = __decorate([
    (0, typeorm_1.Entity)()
], Reaction);
//# sourceMappingURL=reaction.entity.js.map