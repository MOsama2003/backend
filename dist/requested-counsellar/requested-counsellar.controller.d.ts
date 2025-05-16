import { RequestedCounsellarService } from './requested-counsellar.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
export declare class RequestedCounsellarController {
    private readonly requestedCounsellarService;
    constructor(requestedCounsellarService: RequestedCounsellarService);
    create(resume: Express.Multer.File, body: any): Promise<{
        message: string;
        user: import("./entities/requested-counsellar.entity").RequestedCounsellar;
    }>;
    remove(id: string): Promise<{
        message: string;
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
        data: import("./entities/requested-counsellar.entity").RequestedCounsellar[];
    }>;
    findAllApprovedCounsellars(paginationQuery: PaginationQueryDto): Promise<{
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
    findCounsellar(id: string): Promise<import("./entities/requested-counsellar.entity").RequestedCounsellar>;
}
