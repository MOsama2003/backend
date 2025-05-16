import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Farm } from './entities/farm.entity';
import { FarmTask } from './entities/farm-task.entity';
import { FarmService } from './farm.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
export declare class FarmController {
    private readonly farmService;
    private readonly cloudinaryService;
    constructor(farmService: FarmService, cloudinaryService: CloudinaryService);
    createFarm(req: any, createFarmDto: CreateFarmDto): Promise<Farm>;
    getFarms(req: any): Promise<Farm[]>;
    getFarm(req: any, id: string): Promise<Farm>;
    updateFarm(req: any, id: string, updateFarmDto: UpdateFarmDto): Promise<Farm>;
    deleteFarm(req: any, id: string): Promise<void>;
    uploadFarmImages(req: any, id: string, files: {
        images?: Express.Multer.File[];
    }): Promise<Farm>;
    updateTaskStatus(req: any, taskId: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<FarmTask>;
}
