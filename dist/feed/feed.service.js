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
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const feed_entity_1 = require("./entities/feed.entity");
const typeorm_2 = require("typeorm");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const comment_entity_1 = require("./entities/comment.entity");
const reaction_entity_1 = require("./entities/reaction.entity");
const constants_1 = require("../constants");
const user_entity_1 = require("../user/entities/user.entity");
const firebase_service_1 = require("../notifications/firebase.service");
let FeedService = class FeedService {
    constructor(feedRepository, reactionRepository, commentRepository, userRepository, cloudinaryService, notificationService) {
        this.feedRepository = feedRepository;
        this.reactionRepository = reactionRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.notificationService = notificationService;
    }
    async create(createFeedDto, images, req) {
        const { caption } = createFeedDto;
        let Media = [];
        if (images && images.length > 0) {
            const uploadPromises = images.map(async (file) => {
                const uploadedFile = await this.cloudinaryService.uploadFile(file);
                return uploadedFile?.url;
            });
            Media = (await Promise.all(uploadPromises)).filter((url) => !!url);
        }
        const post = this.feedRepository.create({
            caption,
            media: Media,
            publishedDate: new Date().toISOString(),
            publisher: req.user,
        });
        await this.feedRepository.save(post);
        return {
            message: 'Feed created successfully',
            post,
        };
    }
    async deletePost(id) {
        const post = await this.feedRepository.findOne({
            where: { id },
            relations: ['reaction', 'comment'],
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        await this.feedRepository.remove(post);
    }
    async reaction(createReactionDto, req) {
        const { postId, reactionType } = createReactionDto;
        const post = await this.feedRepository.findOne({
            where: { id: Number(postId) },
            relations: ['publisher']
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        const existingReaction = await this.reactionRepository.findOne({
            where: {
                user: { id: req.user.id },
                post: { id: post.id },
            },
            relations: ['user', 'post'],
        });
        if (existingReaction) {
            if (existingReaction.status === reactionType) {
                await this.reactionRepository.remove(existingReaction);
                return { message: `${reactionType} removed successfully` };
            }
            else {
                existingReaction.status = reactionType;
                await this.reactionRepository.save(existingReaction);
                return { message: `Changed to ${reactionType}` };
            }
        }
        const newReaction = this.reactionRepository.create({
            status: reactionType,
            user: req.user,
            post: post,
        });
        await this.reactionRepository.save(newReaction);
        {
            +post.publisher.id !== +req.user.id && await this.notificationService.sendNotification({
                title: 'New Reaction Added',
                body: `${req.user.name} reacted ${reactionType} to your post`,
                data: { postId: String(postId) },
            }, +post.publisher.id);
        }
        return { message: `${reactionType} added successfully` };
    }
    async createComment(createCommentDto, req, postId) {
        const { commentText, parentCommentId } = createCommentDto;
        const post = await this.feedRepository.findOne({
            where: { id: Number(postId) },
            relations: ['publisher']
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        let parentComment = null;
        if (parentCommentId) {
            parentComment = await this.commentRepository.findOne({
                where: { id: Number(parentCommentId) },
            });
            if (!parentComment) {
                throw new common_1.NotFoundException('Parent comment not found');
            }
        }
        let newComment = this.commentRepository.create({
            commentText,
            parentComment: parentComment === null ? undefined : parentComment,
            post,
            commentAuthor: req.user,
            publishedDate: new Date().toISOString(),
        });
        {
            +post.publisher.id !== +req.user.id && await this.notificationService.sendNotification({
                title: 'New Comment Added to Your Post',
                body: `${req.user.name} commented: ${commentText}`,
                data: { postId: String(postId) },
            }, +post.publisher.id);
        }
        return await this.commentRepository.save(newComment);
    }
    async feed(id, req) {
        const post = await this.feedRepository.findOne({
            where: { id: +id },
            relations: ['comment', 'reaction', 'reaction.user', 'publisher'],
        });
        if (!post)
            return null;
        const { reaction = [], comment = [], publisher } = post;
        const userId = req.user?.id;
        let upvoteCount = 0;
        let hasUpvoted = false;
        let hasDownvoted = false;
        for (const r of reaction) {
            if (r.status === constants_1.PostReaction.Upvote) {
                upvoteCount++;
                if (r.user?.id === userId)
                    hasUpvoted = true;
            }
            else if (r.status === constants_1.PostReaction.Devote && r.user?.id === userId) {
                hasDownvoted = true;
            }
        }
        return {
            id: post.id,
            caption: post.caption,
            media: post.media,
            publishedDate: post.publishedDate,
            upvoteCount,
            commentCount: comment.length,
            hasUpvoted,
            hasDownvoted,
            publisher: {
                id: publisher.id,
                name: `${publisher.firstName} ${publisher.lastName}`,
                profilePic: publisher.avatar,
                email: publisher.email,
            },
        };
    }
    async feedListing(paginationQueryDto, req) {
        const { page = 1, limit = 10, search = '' } = paginationQueryDto;
        try {
            const currentPage = Math.max(1, page);
            const take = Math.max(1, limit);
            const skip = (currentPage - 1) * take;
            const searchFilters = search ? [{ caption: (0, typeorm_2.ILike)(`%${search}%`) }] : [];
            const [feed, total] = await this.feedRepository.findAndCount({
                where: searchFilters.length ? searchFilters : undefined,
                order: { publishedDate: 'DESC' },
                skip,
                take,
                relations: ['comment', 'reaction', 'reaction.user', 'publisher'],
            });
            const processedFeed = feed.map((post) => ({
                id: post.id,
                caption: post.caption,
                media: post.media,
                publishedDate: post.publishedDate,
                upvoteCount: post.reaction?.filter((reaction) => reaction.status === constants_1.PostReaction.Upvote).length || 0,
                commentCount: post.comment?.length || 0,
                hasUpvoted: post.reaction?.some((reaction) => {
                    return (reaction.status === constants_1.PostReaction.Upvote &&
                        reaction.user?.id === req.user.id);
                }) || false,
                hasDownvoted: post.reaction?.some((reaction) => reaction.status === constants_1.PostReaction.Devote &&
                    reaction.user?.id === req.user.id) || false,
                publisher: {
                    id: post.publisher.id,
                    name: `${post.publisher.firstName} ${post.publisher.lastName}`,
                    profilePic: post.publisher.avatar,
                    email: post.publisher.email
                },
            }));
            const pageCount = Math.ceil(total / take);
            const hasNextPage = currentPage < pageCount;
            const hasPrevPage = currentPage > 1;
            return {
                data: processedFeed,
                metaData: {
                    totalCount: total,
                    pageCount,
                    page: currentPage,
                    take,
                    hasNextPage,
                    hasPrevPage,
                    itemCount: processedFeed.length,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Something went wrong while fetching posts.');
        }
    }
    async commentListing(commentListingDto, postId) {
        const { page = 1, limit = 10, parentCommentId } = commentListingDto;
        try {
            const currentPage = Math.max(1, page);
            const take = Math.max(1, limit);
            const skip = (currentPage - 1) * take;
            const commentedPost = await this.feedRepository.findOne({
                where: { id: Number(postId) },
            });
            if (!commentedPost) {
                throw new common_1.BadRequestException('Invalid Post ID!');
            }
            const whereCondition = { post: { id: Number(commentedPost.id) } };
            if (parentCommentId !== undefined) {
                whereCondition.parentComment =
                    parentCommentId !== null ? { id: Number(parentCommentId) } : (0, typeorm_2.IsNull)();
            }
            else {
                whereCondition.parentComment = (0, typeorm_2.IsNull)();
            }
            const [comments, total] = await this.commentRepository.findAndCount({
                where: whereCondition,
                skip,
                take,
                relations: ['commentAuthor'],
                select: ['id', 'commentText', 'publishedDate'],
            });
            const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
                const replyCount = await this.commentRepository.count({
                    where: { parentComment: { id: comment.id } },
                });
                return {
                    id: comment.id,
                    commentText: comment.commentText,
                    parentCommentId: comment.parentComment
                        ? comment.parentComment.id
                        : null,
                    publishedDate: comment.publishedDate,
                    numberOfReplies: replyCount,
                    author: comment.commentAuthor
                        ? {
                            id: comment.commentAuthor.id,
                            name: `${comment.commentAuthor.firstName} ${comment.commentAuthor.lastName}`,
                            profilePic: comment.commentAuthor.avatar,
                        }
                        : null,
                };
            }));
            const pageCount = Math.ceil(total / take);
            const hasNextPage = currentPage < pageCount;
            const hasPrevPage = currentPage > 1;
            return {
                data: commentsWithReplies,
                metaData: {
                    totalCount: total,
                    pageCount,
                    page: currentPage,
                    take,
                    hasNextPage,
                    hasPrevPage,
                    itemCount: comments.length,
                },
            };
        }
        catch (error) {
            console.error('Error fetching comments:', error);
            throw new common_1.InternalServerErrorException(error.message || 'Something went wrong while fetching comments.');
        }
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feed_entity_1.Feed)),
    __param(1, (0, typeorm_1.InjectRepository)(reaction_entity_1.Reaction)),
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService,
        firebase_service_1.FirebaseService])
], FeedService);
//# sourceMappingURL=feed.service.js.map