import { SensorDataService } from './sensorData.service';
import { CreateSensorDataDto } from './dto/create-sensorData.dto';
import { PaginationQueryDto } from './dto/Pagination-data.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class SensorDataController {
    private readonly sensorDataService;
    private readonly eventEmitter;
    constructor(sensorDataService: SensorDataService, eventEmitter: EventEmitter2);
    addSensorData(data: CreateSensorDataDto, req: any): Promise<import("./entities/sensorData.entity").SensorData>;
    findAll(paginationQuery: PaginationQueryDto, req: any): Promise<{
        data: import("./entities/sensorData.entity").SensorData[];
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
    findLast(req: any): Promise<import("./entities/sensorData.entity").SensorData | null>;
}
