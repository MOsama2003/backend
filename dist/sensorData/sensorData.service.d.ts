import { Repository } from 'typeorm';
import { SensorData } from './entities/sensorData.entity';
import { CreateSensorDataDto } from './dto/create-sensorData.dto';
import { UserService } from 'src/user/user.service';
import { PaginationQueryDto } from './dto/Pagination-data.dto';
import { FirebaseService } from 'src/notifications/firebase.service';
export declare class SensorDataService {
    private readonly sensorDataRepository;
    private readonly userService;
    private readonly notificationService;
    constructor(sensorDataRepository: Repository<SensorData>, userService: UserService, notificationService: FirebaseService);
    create(data: CreateSensorDataDto): Promise<SensorData>;
    private validateSensorData;
    private validateBusinessRules;
    dataListing(PaginationQueryDto: PaginationQueryDto, req: any): Promise<{
        data: SensorData[];
        metaData: {
            totalCount: number;
            pageCount: number;
            page: number;
            take: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            itemCount: number;
        };
    }>;
    lastEntry(deviceId: string): Promise<SensorData | null>;
    lastTwoEntries(deviceId: string): Promise<SensorData[]>;
}
