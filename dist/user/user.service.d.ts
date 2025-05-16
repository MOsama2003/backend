import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { CreateNonDeviceOwnerDto } from './dto/create-non-device-owner.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { User } from './entities/user.entity';
import { StreamService } from 'src/stream/stream.service';
export declare class UserService {
    private readonly userRepository;
    private readonly counsellarRepository;
    private readonly cloudinaryService;
    private readonly mailService;
    private readonly streamService;
    constructor(userRepository: Repository<User>, counsellarRepository: Repository<RequestedCounsellar>, cloudinaryService: CloudinaryService, mailService: MailService, streamService: StreamService);
    private generateRandomPassword;
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
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
        data: User[];
    }>;
    softDeleteUser(id: string): Promise<User>;
    findById(id: number): Promise<User | null>;
    findByIdForNotification(id: number): Promise<User | null>;
    setAvatar(userId: string | number, file: Express.Multer.File): Promise<{
        message: string;
        avatarUrl: string;
    }>;
    findByDeviceId(id: string): Promise<User | null>;
    approveCounsellarById(id: number): Promise<{
        message: string;
        counsellarId: number;
        userId: number;
    }>;
    registerNonDeviceOwner(createNonDeviceOwnerDto: CreateNonDeviceOwnerDto): Promise<User>;
    findUserByIds(userIds: Number[]): Promise<User[]>;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
