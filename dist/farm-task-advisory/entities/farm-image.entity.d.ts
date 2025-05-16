import { Farm } from './farm.entity';
export declare class FarmImage {
    id: string;
    url: string;
    publicId: string;
    uploadDate: Date;
    farm: Farm;
    farmId: string;
    createdAt: Date;
}
