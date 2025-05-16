"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedModule = void 0;
const common_1 = require("@nestjs/common");
const feed_service_1 = require("./feed.service");
const feed_controller_1 = require("./feed.controller");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const typeorm_1 = require("@nestjs/typeorm");
const feed_entity_1 = require("./entities/feed.entity");
const comment_entity_1 = require("./entities/comment.entity");
const reaction_entity_1 = require("./entities/reaction.entity");
const user_entity_1 = require("../user/entities/user.entity");
const notifications_module_1 = require("../notifications/notifications.module");
let FeedModule = class FeedModule {
};
exports.FeedModule = FeedModule;
exports.FeedModule = FeedModule = __decorate([
    (0, common_1.Module)({
        controllers: [feed_controller_1.FeedController],
        providers: [feed_service_1.FeedService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([feed_entity_1.Feed, comment_entity_1.Comment, reaction_entity_1.Reaction, user_entity_1.User]),
            cloudinary_module_1.CloudinaryModule,
            notifications_module_1.NotificationsModule
        ],
    })
], FeedModule);
//# sourceMappingURL=feed.module.js.map