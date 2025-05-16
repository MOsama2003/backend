import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { SensorBasedEventAndTaskMgtService } from './sensor-based-event-and-task-mgt.service';
import { GetDeviceAdvisoryDto, GetDeviceTasksDto } from './dto/get-sensor-based-tasks.dto';
export declare class SensorBasedEventAndTaskMgtController {
    private readonly sensorBasedEventAndTaskMgtService;
    constructor(sensorBasedEventAndTaskMgtService: SensorBasedEventAndTaskMgtService);
    createFarm(createFarmDto: CreateSensorBasedEventAndTaskMgtDto, req: any): Promise<import("./entities/sensor-based-event-and-task-mgt.entity").SensorOnboarding>;
    getAdvisory(deviceId: string, req: any): Promise<import("./entities/advisory.entity").DeviceAdvisory[] | {
        status: number;
        message: string;
    } | undefined>;
    updateFarmDetails(updateFarmDto: CreateSensorBasedEventAndTaskMgtDto, req: any): Promise<{
        message: string;
    }>;
    getFarmDetails(req: any): Promise<{
        found: boolean;
        data: import("./entities/sensor-based-event-and-task-mgt.entity").SensorOnboarding | null;
        deviceId: string;
    }[]>;
    getTask(deviceId: string, req: any): Promise<import("./entities/task.entity").DeviceTasks[] | {
        status: number;
        message: string;
    } | undefined>;
    updateTasks(deviceId: string, req: any): Promise<void | {
        status: number;
        message: string;
    }>;
    generateReport(deviceId: string, req: any): Promise<import("./entities/week-summary.entity").WeeklyFarmReport[] | {
        status: number;
        message: string;
    } | undefined>;
    updateTaskStatus(id: string, body: UpdateTaskStatusDto): Promise<import("typeorm").UpdateResult>;
    taskListing(req: any, query: GetDeviceTasksDto): Promise<{
        advisories: null;
        total?: undefined;
        page?: undefined;
        limit?: undefined;
        tasks?: undefined;
    } | {
        total: number;
        page: number;
        limit: number;
        tasks: import("./entities/task.entity").DeviceTasks[];
        advisories?: undefined;
    }>;
    advisoryListing(req: any, query: GetDeviceAdvisoryDto): Promise<{
        advisories: null;
        total?: undefined;
        page?: undefined;
        limit?: undefined;
    } | {
        total: number;
        page: number;
        limit: number;
        advisories: import("./entities/advisory.entity").DeviceAdvisory[];
    }>;
    reportListing(req: any, query: GetDeviceAdvisoryDto): Promise<{
        advisories: null;
        total?: undefined;
        page?: undefined;
        limit?: undefined;
        weeklyReports?: undefined;
    } | {
        total: number;
        page: number;
        limit: number;
        weeklyReports: import("./entities/week-summary.entity").WeeklyFarmReport[];
        advisories?: undefined;
    }>;
    dashboard(req: any): Promise<{
        report: import("./entities/week-summary.entity").WeeklyFarmReport | null;
        advisory: import("./entities/advisory.entity").DeviceAdvisory | null;
        task: import("./entities/task.entity").DeviceTasks | null;
    }>;
    getTaskStatusCounts(req: any): Promise<{
        result: null;
    } | {
        result: Record<import("../constants").TaskStatus, number>;
    }>;
}
