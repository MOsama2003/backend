import { CreateRequestedCounsellarDto } from './dto/create-requested-counsellar.dto';
import { RequestedCounsellar } from './entities/requested-counsellar.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailService } from 'src/mail/mail.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
export declare class RequestedCounsellarService {
    private readonly requestedCounsellarRepository;
    private readonly cloudinaryService;
    private readonly mailService;
    constructor(requestedCounsellarRepository: Repository<RequestedCounsellar>, cloudinaryService: CloudinaryService, mailService: MailService);
    create(resume: Express.Multer.File, createRequestedCounsellarDto: CreateRequestedCounsellarDto): Promise<{
        message: string;
        user: RequestedCounsellar;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findCounsellarById(id: number): Promise<RequestedCounsellar>;
    find(email: string): Promise<RequestedCounsellar[]>;
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
        data: RequestedCounsellar[];
    }>;
    findAllApprovedCounsellar(paginationQuery: PaginationQueryDto): Promise<{
        metaData: {
            totalCount: number;
            pageCount: number;
            page: number;
            take: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            itemCount: number;
        };
        data: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            startTime: string;
            endTime: string;
            expertise: string;
            workingDays: number[];
            yoe: string;
            avatar: string | null;
        }[];
    }>;
}
