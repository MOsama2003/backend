import { PostReaction } from 'src/constants';
import { User } from 'src/user/entities/user.entity';
import { Feed } from './feed.entity';
export declare class Reaction {
    id: number;
    status: PostReaction;
    user: User;
    post: Feed;
}
