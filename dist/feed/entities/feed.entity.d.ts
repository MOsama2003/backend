import { User } from "src/user/entities/user.entity";
import { Reaction } from "./reaction.entity";
import { Comment } from "./comment.entity";
export declare class Feed {
    id: number;
    media: string[];
    caption: string;
    publishedDate: string;
    publisher: User;
    reaction: Reaction[];
    comment: Comment[];
}
