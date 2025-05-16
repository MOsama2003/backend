import { TaskSeverity, TaskStatus } from 'src/constants';
export declare class DeviceTasks {
    id: number;
    taskTitle: string;
    taskDescription: string;
    taskSeverity: TaskSeverity;
    taskStatus: TaskStatus;
    deviceId: string;
    deadliestDeadline: string;
    notes: string;
    createdAt: Date;
}
