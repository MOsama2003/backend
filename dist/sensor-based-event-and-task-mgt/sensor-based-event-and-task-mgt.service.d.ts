import { SensorDataService } from 'src/sensorData/sensorData.service';
import { Repository } from 'typeorm';
import { SensorBasedAdvisoryService } from './advisory-generation.service';
import { CreateSensorBasedEventAndTaskMgtDto } from './dto/create-sensor-based-event-and-task-mgt.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { SensorOnboarding } from './entities/sensor-based-event-and-task-mgt.entity';
import { SensorBasedTaskService } from './tasks-generation.service';
import { SensorBasedWeeklySummaryService } from './weekly-summary.service';
import { GetDeviceAdvisoryDto, GetDeviceTasksDto } from './dto/get-sensor-based-tasks.dto';
export declare class SensorBasedEventAndTaskMgtService {
    private readonly farmRepository;
    private readonly sensorDataService;
    private readonly sensorBasedAdvisoryService;
    private readonly sensorBasedTaskService;
    private readonly sensorBasedWeeklySummaryService;
    constructor(farmRepository: Repository<SensorOnboarding>, sensorDataService: SensorDataService, sensorBasedAdvisoryService: SensorBasedAdvisoryService, sensorBasedTaskService: SensorBasedTaskService, sensorBasedWeeklySummaryService: SensorBasedWeeklySummaryService);
    create(createFarmDto: CreateSensorBasedEventAndTaskMgtDto & {
        deviceId: string;
    }): Promise<SensorOnboarding>;
    getFormByDeviceId(deviceId: string): Promise<{
        found: boolean;
        data: SensorOnboarding | null;
        deviceId: string;
    }[]>;
    update(deviceId: string, updateFarmDto: CreateSensorBasedEventAndTaskMgtDto): Promise<{
        message: string;
    }>;
    addAdvisories(deviceId: string, req: any): Promise<import("./entities/advisory.entity").DeviceAdvisory[] | {
        status: number;
        message: string;
    } | undefined>;
    addTasks(deviceId: string, req: any): Promise<import("./entities/task.entity").DeviceTasks[] | {
        status: number;
        message: string;
    } | undefined>;
    updateTasks(deviceId: string, req: any): Promise<void | {
        status: number;
        message: string;
    }>;
    weeklyReport(deviceId: string, req: any): Promise<import("./entities/week-summary.entity").WeeklyFarmReport[] | {
        status: number;
        message: string;
    } | undefined>;
    updateTaskStatus(data: UpdateTaskStatusDto): Promise<import("typeorm").UpdateResult>;
    getTasks(deviceId: string, query: GetDeviceTasksDto): Promise<{
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
    getAdvisories(deviceId: string, query: GetDeviceAdvisoryDto): Promise<{
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
    getWeeklyReport(deviceId: string, query: GetDeviceAdvisoryDto): Promise<{
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
    dashboard(deviceId: string): Promise<{
        report: import("./entities/week-summary.entity").WeeklyFarmReport | null;
        advisory: import("./entities/advisory.entity").DeviceAdvisory | null;
        task: import("./entities/task.entity").DeviceTasks | null;
    }>;
    getTaskStatusCounts(deviceId: string): Promise<{
        result: null;
    } | {
        result: Record<import("../constants").TaskStatus, number>;
    }>;
}
