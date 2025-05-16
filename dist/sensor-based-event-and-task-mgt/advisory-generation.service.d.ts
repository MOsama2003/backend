import { Repository } from 'typeorm';
import { DeviceAdvisory } from './entities/advisory.entity';
import { FirebaseService } from 'src/notifications/firebase.service';
import { GetDeviceAdvisoryDto } from './dto/get-sensor-based-tasks.dto';
export declare class SensorBasedAdvisoryService {
    private readonly advisoryRepository;
    private readonly notificationService;
    constructor(advisoryRepository: Repository<DeviceAdvisory>, notificationService: FirebaseService);
    saveAdvisories(advisories: any[], deviceId: string, req: any): Promise<DeviceAdvisory[]>;
    getAdvisoryOfWholeWeek(deviceId: string): Promise<DeviceAdvisory[]>;
    lastTwoEntries(deviceId: string): Promise<DeviceAdvisory[]>;
    getAdvisories(deviceId: string, query: GetDeviceAdvisoryDto): Promise<{
        advisories: null;
        total?: undefined;
        page?: undefined;
        limit?: undefined;
    } | {
        total: number;
        page: number;
        limit: number;
        advisories: DeviceAdvisory[];
    }>;
    lastEntry(deviceId: string): Promise<{
        advisory: DeviceAdvisory | null;
    }>;
}
