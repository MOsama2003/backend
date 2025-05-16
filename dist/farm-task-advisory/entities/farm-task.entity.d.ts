import { Farm } from './farm.entity';
export declare enum TaskStatus {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled"
}
export declare class FarmTask {
    id: string;
    taskId: string;
    title: string;
    priority: string;
    dueDate: Date;
    status: TaskStatus;
    context: string;
    taskDescription: string;
    steps: string[];
    supportingInformation: string;
    followUp: string;
    dependencies: string[];
    farm: Farm;
    farmId: string;
    createdAt: Date;
    updatedAt: Date;
}
