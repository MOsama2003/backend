import { User } from 'src/user/entities/user.entity';
import { Feed } from './feed.entity';
export declare class Comment {
    id: number;
    commentText: string;
    parentComment: Comment;
    publishedDate: string;
    commentAuthor: User;
    post: Feed;
}
