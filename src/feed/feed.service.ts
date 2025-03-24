import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './entities/feed.entity';
import { ILike, In, IsNull, Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Comment } from './entities/comment.entity';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/reaction-feed.dto';
import { PostReaction } from 'src/constants';
import { CommentListingDto, CreateCommentDto } from './dto/comment-feed.dto';
import { User } from 'src/user/entities/user.entity';
import { PaginationQueryDto } from './dto/pagination-feed.dto';
import { FirebaseService } from 'src/notifications/firebase.service';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationService: FirebaseService,
  ) {}

  async create(
    createFeedDto: CreateFeedDto,
    images: Express.Multer.File[],
    req: any,
  ) {
    const { caption } = createFeedDto;
    let Media: string[] = [];

    if (images && images.length > 0) {
      const uploadPromises = images.map(async (file) => {
        const uploadedFile = await this.cloudinaryService.uploadFile(file);
        return uploadedFile?.url;
      });
      Media = (await Promise.all(uploadPromises)).filter(
        (url): url is string => !!url,
      );
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

  async reaction(createReactionDto: CreateReactionDto, req: any) {
    const { postId, reactionType } = createReactionDto;
    const post = await this.feedRepository.findOne({
      where: { id: Number(postId) },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const existingReaction = await this.reactionRepository.findOne({
      where: { user: req.user, post: post },
    });

    if (existingReaction) {
      if (existingReaction.status === reactionType) {
        await this.reactionRepository.remove(existingReaction);
        return { message: `${reactionType} removed successfully` };
      } else {
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

    await this.notificationService.sendNotification(
      {
        title: 'New Reaction Added',
        body: `${req.user.name} reacted ${reactionType} to your post`,
        data: { postId },
      },
      +post.publisher.id,
    );

    return { message: `${reactionType} added successfully` };
  }

  async createComment(createCommentDto: CreateCommentDto, req: any) {
    const { commentText, mentions, parentCommentId, postId } = createCommentDto;
    const post = await this.feedRepository.findOne({
      where: { id: Number(postId) },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let parentComment: Comment | null = null;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: Number(parentCommentId) },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    let mentionedUsers: User[] = [];
    if (mentions && mentions.length > 0) {
      mentionedUsers = await this.userRepository.find({
        where: { id: In(mentions) },
      });
    }

    let newComment = this.commentRepository.create({
      commentText,
      parentComment: parentComment === null ? undefined : parentComment,
      post,
      commentAuthor: req.user,
      publishedDate: new Date().toISOString(),
    });

    newComment.mentions = mentionedUsers;
    await this.notificationService.sendNotification(
      {
        title: 'New Comment Added to Your Post',
        body: `${req.user.name} commented: ${commentText}`,
        data: { postId },
      },
      +post.publisher.id,
    );

    return await this.commentRepository.save(newComment);
  }

  async feedListing(paginationQueryDto: PaginationQueryDto, req: any) {
    const { page = 1, limit = 10, search = '' } = paginationQueryDto;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const searchFilters = search ? [{ caption: ILike(`%${search}%`) }] : [];

      const [feed, total] = await this.feedRepository.findAndCount({
        where: searchFilters.length ? searchFilters : undefined,
        skip,
        take,
        relations: ['comment', 'reaction', 'reaction.user', 'publisher'], // Load user in reaction
      });

      const processedFeed = feed.map((post) => ({
        id: post.id,
        caption: post.caption,
        media: post.media,
        publishedDate: post.publishedDate,
        upvoteCount:
          post.reaction?.filter(
            (reaction) => reaction.status === PostReaction.Upvote,
          ).length || 0,
        commentCount: post.comment?.length || 0,
        hasUpvoted:
          post.reaction?.some((reaction) => {
            return (
              reaction.status === PostReaction.Upvote &&
              reaction.user?.id === req.user.id
            );
          }) || false,
        hasDownvoted:
          post.reaction?.some(
            (reaction) =>
              reaction.status === PostReaction.Devote &&
              reaction.user?.id === req.user.id,
          ) || false,
        publisher: {
          id: post.publisher.id,
          name: `${post.publisher.firstName} ${post.publisher.lastName}`,
          profilePic: post.publisher.avatar,
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
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while fetching posts.',
      );
    }
  }

  async commentListing(commentListingDto: CommentListingDto) {
    const { page = 1, limit = 10, parentCommentId, postId } = commentListingDto;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const commentedPost = await this.feedRepository.findOne({
        where: { id: Number(postId) },
      });

      if (!commentedPost) {
        throw new BadRequestException('Invalid Post ID!');
      }
      const whereCondition: any = { post: { id: commentedPost.id } };
      if (parentCommentId !== undefined) {
        whereCondition.parentComment =
          parentCommentId !== null ? { id: Number(parentCommentId) } : IsNull();
      } else {
        whereCondition.parentComment = IsNull();
      }

      const [comments, total] = await this.commentRepository.findAndCount({
        where: whereCondition,
        skip,
        take,
        relations: ['commentAuthor'],
        select: ['id', 'commentText', 'mentions', 'publishedDate'],
      });

      // Fetch reply count for each comment
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replyCount = await this.commentRepository.count({
            where: { parentComment: { id: comment.id } },
          });

          return {
            id: comment.id,
            commentText: comment.commentText,
            mentions: comment.mentions,
            parentCommentId: comment.parentComment
              ? comment.parentComment.id
              : null,
            publishedDate: comment.publishedDate,
            numberOfReplies: replyCount,
            mention: comment.mentions,
            author: comment.commentAuthor
              ? {
                  id: comment.commentAuthor.id,
                  name: `${comment.commentAuthor.firstName} ${comment.commentAuthor.lastName}`,
                  profilePic: comment.commentAuthor.avatar,
                }
              : null,
          };
        }),
      );

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
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new InternalServerErrorException(
        error.message || 'Something went wrong while fetching comments.',
      );
    }
  }
}
