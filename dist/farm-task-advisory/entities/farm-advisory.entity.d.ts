import { Farm } from './farm.entity';
export declare class FarmAdvisory {
    id: string;
    advisoryData: Record<string, any>;
    advisoryDate: Date;
    farm: Farm;
    farmId: string;
    createdAt: Date;
}
