import { BlogService } from './blog.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    create(req: any, articleImage: Express.Multer.File, body: any): Promise<{
        message: string;
        article: import("./entities/blog.entity").Blog;
    }>;
    update(id: number, req: any, articleImage: Express.Multer.File, body: any): Promise<{
        message: string;
        article: {
            articleContent: string;
            articleTitle: string;
            articleImage: string;
            user: any;
            id: number;
            articlePublishDate: string;
            isUrdu: boolean;
        };
    }>;
    findAll(paginationQuery: PaginationQueryDto): Promise<{
        metaData: {
            totalCount: number;
            pageCount: number;
            page: number;
            take: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            itemCount: number;
        };
        data: import("./entities/blog.entity").Blog[];
    }>;
    findOne(id: string): Promise<import("./entities/blog.entity").Blog | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
