export declare enum TaskStatus {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled"
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
}
