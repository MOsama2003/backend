import { CreateBlogDto } from './dto/create-blog.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FirebaseService } from 'src/notifications/firebase.service';
export declare class BlogService {
    private readonly blogRepository;
    private readonly cloudinaryService;
    private readonly notificationService;
    constructor(blogRepository: Repository<Blog>, cloudinaryService: CloudinaryService, notificationService: FirebaseService);
    update(id: number, updateBlogDto: CreateBlogDto, newImage?: Express.Multer.File, req?: any): Promise<{
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
    create(articleImage: Express.Multer.File, createBlogDto: CreateBlogDto, req: any): Promise<{
        message: string;
        article: Blog;
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
        data: Blog[];
    }>;
    findOne(id: number): Promise<Blog | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
