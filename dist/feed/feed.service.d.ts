import { CreateFeedDto } from './dto/create-feed.dto';
import { Feed } from './entities/feed.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Comment } from './entities/comment.entity';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/reaction-feed.dto';
import { CommentListingDto, CreateCommentDto } from './dto/comment-feed.dto';
import { User } from 'src/user/entities/user.entity';
import { PaginationQueryDto } from './dto/pagination-feed.dto';
import { FirebaseService } from 'src/notifications/firebase.service';
export declare class FeedService {
    private readonly feedRepository;
    private readonly reactionRepository;
    private readonly commentRepository;
    private readonly userRepository;
    private readonly cloudinaryService;
    private readonly notificationService;
    constructor(feedRepository: Repository<Feed>, reactionRepository: Repository<Reaction>, commentRepository: Repository<Comment>, userRepository: Repository<User>, cloudinaryService: CloudinaryService, notificationService: FirebaseService);
    create(createFeedDto: CreateFeedDto, images: Express.Multer.File[], req: any): Promise<{
        message: string;
        post: Feed;
    }>;
    deletePost(id: number): Promise<void>;
    reaction(createReactionDto: CreateReactionDto, req: any): Promise<{
        message: string;
    }>;
    createComment(createCommentDto: CreateCommentDto, req: any, postId: number): Promise<Comment>;
    feed(id: string, req: any): Promise<{
        id: number;
        caption: string;
        media: string[];
        publishedDate: string;
        upvoteCount: number;
        commentCount: number;
        hasUpvoted: boolean;
        hasDownvoted: boolean;
        publisher: {
            id: number;
            name: string;
            profilePic: string;
            email: string;
        };
    } | null>;
    feedListing(paginationQueryDto: PaginationQueryDto, req: any): Promise<{
        data: {
            id: number;
            caption: string;
            media: string[];
            publishedDate: string;
            upvoteCount: number;
            commentCount: number;
            hasUpvoted: boolean;
            hasDownvoted: boolean;
            publisher: {
                id: number;
                name: string;
                profilePic: string;
                email: string;
            };
        }[];
        metaData: {
            totalCount: number;
            pageCount: number;
            page: number;
            take: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            itemCount: number;
        };
    }>;
    commentListing(commentListingDto: CommentListingDto, postId: number): Promise<{
        data: {
            id: number;
            commentText: string;
            parentCommentId: number | null;
            publishedDate: string;
            numberOfReplies: number;
            author: {
                id: number;
                name: string;
                profilePic: string;
            } | null;
        }[];
        metaData: {
            totalCount: number;
            pageCount: number;
            page: number;
            take: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            itemCount: number;
        };
    }>;
}
