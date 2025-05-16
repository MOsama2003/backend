import { User } from 'src/user/entities/user.entity';
export declare class Blog {
    id: number;
    articleContent: string;
    articleImage: string;
    articleTitle: string;
    articlePublishDate: string;
    user: User;
    isUrdu: boolean;
}
