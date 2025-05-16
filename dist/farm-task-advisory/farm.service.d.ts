import { Repository, DataSource } from 'typeorm';
import { Farm } from './entities/farm.entity';
import { FarmImage } from './entities/farm-image.entity';
import { FarmImageReport } from './entities/farm-image-report.entity';
import { FarmTask } from './entities/farm-task.entity';
import { FarmAdvisory } from './entities/farm-advisory.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PythonApiService } from './services/python-api.service';
import { FirebaseService } from 'src/notifications/firebase.service';
export declare enum TaskStatus {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled"
}
export declare class FarmService {
    private readonly farmRepository;
    private readonly farmImageRepository;
    private readonly farmImageReportRepository;
    private readonly farmTaskRepository;
    private readonly farmAdvisoryRepository;
    private readonly cloudinaryService;
    private readonly pythonApiService;
    private readonly dataSource;
    private readonly notificationService;
    private readonly logger;
    constructor(farmRepository: Repository<Farm>, farmImageRepository: Repository<FarmImage>, farmImageReportRepository: Repository<FarmImageReport>, farmTaskRepository: Repository<FarmTask>, farmAdvisoryRepository: Repository<FarmAdvisory>, cloudinaryService: CloudinaryService, pythonApiService: PythonApiService, dataSource: DataSource, notificationService: FirebaseService);
    createFarm(userId: string, createFarmDto: CreateFarmDto): Promise<Farm>;
    getFarms(userId: string): Promise<Farm[]>;
    getFarmById(userId: string, farmId: string): Promise<Farm>;
    updateFarm(userId: string, farmId: string, updateFarmDto: UpdateFarmDto): Promise<Farm>;
    deleteFarm(userId: string, farmId: string): Promise<void>;
    uploadFarmImages(userId: string, farmId: string, files: Express.Multer.File[]): Promise<Farm>;
    private processUploadedImages;
    updateTaskStatus(userId: string, taskId: string, status: TaskStatus): Promise<FarmTask>;
}
