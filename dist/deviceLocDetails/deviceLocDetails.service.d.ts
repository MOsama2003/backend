import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateDeviceLocDetails } from './dto/create-deviceLocDetails.dto';
import { DeviceLocDetails } from './entities/deviceLocDetails.entity';
export declare class DeviceLocDetailsService {
    private readonly deviceLocDetailRepository;
    private readonly userService;
    constructor(deviceLocDetailRepository: Repository<DeviceLocDetails>, userService: UserService);
    private validateCoordinates;
    createOrUpdate(data: CreateDeviceLocDetails): Promise<DeviceLocDetails | {
        message: string;
        deviceId: string;
    }>;
    getByDeviceId(deviceId: string): Promise<DeviceLocDetails>;
}
