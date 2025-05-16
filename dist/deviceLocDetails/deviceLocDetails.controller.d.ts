import { DeviceLocDetailsService } from './deviceLocDetails.service';
import { CreateDeviceLocDetails } from './dto/create-deviceLocDetails.dto';
export declare class DeviceLocDetailsController {
    private readonly deviceLocDetailsService;
    constructor(deviceLocDetailsService: DeviceLocDetailsService);
    addOrUpdateSensorData(data: CreateDeviceLocDetails): Promise<import("./entities/deviceLocDetails.entity").DeviceLocDetails | {
        message: string;
        deviceId: string;
    }>;
    getSensorLocation(req: any): Promise<import("./entities/deviceLocDetails.entity").DeviceLocDetails>;
}
