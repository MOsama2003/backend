import { Repository } from 'typeorm';
import { DeviceTasks } from './entities/task.entity';
import { TaskStatus } from 'src/constants';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { FirebaseService } from 'src/notifications/firebase.service';
import { GetDeviceTasksDto } from './dto/get-sensor-based-tasks.dto';
export declare class SensorBasedTaskService {
    private readonly taskRepository;
    private readonly notificationService;
    constructor(taskRepository: Repository<DeviceTasks>, notificationService: FirebaseService);
    saveTasks(tasks: any[], deviceId: string, req: any): Promise<DeviceTasks[]>;
    lastTwoEntries(deviceId: string): Promise<DeviceTasks[]>;
    unCompleteTasks(deviceId: string): Promise<DeviceTasks[]>;
    updateTasks(updatedTasks: any[], deviceId: string, req: any): Promise<void>;
    getTasksOfWholeWeek(deviceId: string): Promise<DeviceTasks[]>;
    private mapTaskStatus;
    private mapTaskSeverity;
    updateStatus(data: UpdateTaskStatusDto): Promise<import("typeorm").UpdateResult>;
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
        tasks: DeviceTasks[];
        advisories?: undefined;
    }>;
    lastEntry(deviceId: string): Promise<{
        task: DeviceTasks | null;
    }>;
    getTaskStatusCounts(deviceId: string): Promise<{
        result: null;
    } | {
        result: Record<TaskStatus, number>;
    }>;
}
