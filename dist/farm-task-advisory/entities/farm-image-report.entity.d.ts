import { Farm } from './farm.entity';
export declare class FarmImageReport {
    id: string;
    reportText: string;
    summary: string;
    reportDate: Date;
    farm: Farm;
    farmId: string;
    createdAt: Date;
}
