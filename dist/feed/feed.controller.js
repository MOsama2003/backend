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
exports.FeedController = void 0;
const common_1 = require("@nestjs/common");
const feed_service_1 = require("./feed.service");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const pagination_feed_dto_1 = require("./dto/pagination-feed.dto");
const reaction_feed_dto_1 = require("./dto/reaction-feed.dto");
const comment_feed_dto_1 = require("./dto/comment-feed.dto");
let FeedController = class FeedController {
    constructor(feedService) {
        this.feedService = feedService;
    }
    create(body, images, req) {
        if (!body || Object.keys(body).length === 0) {
            throw new Error('Body is undefined, ensure you are sending form-data correctly.');
        }
        const createFeedDto = {
            caption: body.caption,
        };
        return this.feedService.create(createFeedDto, images, req);
    }
    findAll(paginationQuery, req) {
        return this.feedService.feedListing(paginationQuery, req);
    }
    async deletePost(id) {
        return this.feedService.deletePost(id);
    }
    async feed(id, req) {
        return this.feedService.feed(String(id), req);
    }
    react(createReactionDto, req) {
        return this.feedService.reaction(createReactionDto, req);
    }
    commentLisitng(commentListing, postId) {
        return this.feedService.commentListing(commentListing, postId);
    }
    comment(createCommentDto, req, postId) {
        return this.feedService.createComment(createCommentDto, req, +postId);
    }
};
exports.FeedController = FeedController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Write Post' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                caption: { type: 'string' },
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post created successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 5)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/listing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of Posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of Posts' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_feed_dto_1.PaginationQueryDto, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FeedController.prototype, "feed", null);
__decorate([
    (0, common_1.Post)('/reaction'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Post Reaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'React to the Post' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reaction_feed_dto_1.CreateReactionDto, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "react", null);
__decorate([
    (0, common_1.Get)('/comment-listing/:postId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of Comments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of Comments' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_feed_dto_1.CommentListingDto, Number]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "commentLisitng", null);
__decorate([
    (0, common_1.Post)('/comment/:postId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Comment on Post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment to the Post' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_feed_dto_1.CreateCommentDto, Object, Number]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "comment", null);
exports.FeedController = FeedController = __decorate([
    (0, common_1.Controller)('feed'),
    __metadata("design:paramtypes", [feed_service_1.FeedService])
], FeedController);
//# sourceMappingURL=feed.controller.js.map