import { FeedService } from './feed.service';
import { PaginationQueryDto } from './dto/pagination-feed.dto';
import { CreateReactionDto } from './dto/reaction-feed.dto';
import { CommentListingDto, CreateCommentDto } from './dto/comment-feed.dto';
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    create(body: any, images: Express.Multer.File[], req: any): Promise<{
        message: string;
        post: import("./entities/feed.entity").Feed;
    }>;
    findAll(paginationQuery: PaginationQueryDto, req: any): Promise<{
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
    deletePost(id: number): Promise<void>;
    feed(id: number, req: any): Promise<{
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
    react(createReactionDto: CreateReactionDto, req: any): Promise<{
        message: string;
    }>;
    commentLisitng(commentListing: CommentListingDto, postId: number): Promise<{
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
    comment(createCommentDto: CreateCommentDto, req: any, postId: number): Promise<import("./entities/comment.entity").Comment>;
}
