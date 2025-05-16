import { TaskStatus } from 'src/constants';
export declare class GetDeviceTasksDto {
    taskStatus?: TaskStatus;
    page?: number;
    limit?: number;
}
export declare class GetDeviceAdvisoryDto {
    page?: number;
    limit?: number;
}
