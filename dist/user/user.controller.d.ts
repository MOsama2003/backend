import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { CreateNonDeviceOwnerDto } from './dto/create-non-device-owner.dto';
import { ChangePasswordDto } from './dto/changePasswordDto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createCounsellar(id: number): Promise<{
        message: string;
        counsellarId: number;
        userId: number;
    }>;
    createDeviceOwner(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    create(createNonDeviceOwnerDto: CreateNonDeviceOwnerDto): Promise<import("./entities/user.entity").User>;
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
        data: import("./entities/user.entity").User[];
    }>;
    findUserById(req: any): Promise<import("./entities/user.entity").User | null>;
    disableUser(id: string): Promise<import("./entities/user.entity").User>;
    setAvatar(file: Express.Multer.File, req: any): Promise<{
        message: string;
        avatarUrl: string;
    }>;
    changePassword(req: any, body: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
