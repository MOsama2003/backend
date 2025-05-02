// farm.service.ts
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Farm } from './entities/farm.entity';
import { FarmImage } from './entities/farm-image.entity';
import { FarmImageReport } from './entities/farm-image-report.entity';
import { FarmTask } from './entities/farm-task.entity';
import { FarmAdvisory } from './entities/farm-advisory.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PythonApiService } from './services/python-api.service';

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

@Injectable()
export class FarmService {
  private readonly logger = new Logger(FarmService.name);

  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(FarmImage)
    private readonly farmImageRepository: Repository<FarmImage>,
    @InjectRepository(FarmImageReport)
    private readonly farmImageReportRepository: Repository<FarmImageReport>,
    @InjectRepository(FarmTask)
    private readonly farmTaskRepository: Repository<FarmTask>,
    @InjectRepository(FarmAdvisory)
    private readonly farmAdvisoryRepository: Repository<FarmAdvisory>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly pythonApiService: PythonApiService,
    private readonly dataSource: DataSource,
  ) {}

  async createFarm(userId: string, createFarmDto: CreateFarmDto): Promise<Farm> {
    const existingFarmsCount = await this.farmRepository.count({
      where: { userId }
    });

    const farmNumber = existingFarmsCount + 1;
    const displayId = `Farm-0-${farmNumber}`;

    const farm = this.farmRepository.create({
      userId,
      displayId,
      name: createFarmDto.name,
      farmLocation: createFarmDto.farmLocation,
      totalLandArea: createFarmDto.totalLandArea,
      crop: createFarmDto.crop,
      latitude: createFarmDto.latitude,
      longitude: createFarmDto.longitude,
      soilType: createFarmDto.soilType,
      waterSource: createFarmDto.waterSource,
      sowingDate: new Date(createFarmDto.sowingDate),
      currentGrowthStage: createFarmDto.currentGrowthStage,
      pastPestIssues: createFarmDto.pastPestIssues,
      irrigationType: createFarmDto.irrigationType,
      waterAvailabilityStatus: createFarmDto.waterAvailabilityStatus,
      fertilizersUsed: createFarmDto.fertilizersUsed,
      onboardingCompleted: false,
      additionalDetails: {} 
    });
      
    return this.farmRepository.save(farm);
  }

  async getFarms(userId: string): Promise<Farm[]> {
    return this.farmRepository.find({
      where: { userId },
      relations: ['images', 'reports', 'tasks', 'advisories'],
    });
  }

  async getFarmById(userId: string, farmId: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id: farmId, userId },
      relations: ['images', 'reports', 'tasks', 'advisories'],
    });

    if (!farm) {
      throw new NotFoundException('Farm not found');
    }

    return farm;
  }

  async updateFarm(userId: string, farmId: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.getFarmById(userId, farmId);
    
    if (updateFarmDto.name !== undefined) farm.name = updateFarmDto.name;
    if (updateFarmDto.farmLocation !== undefined) farm.farmLocation = updateFarmDto.farmLocation;
    if (updateFarmDto.totalLandArea !== undefined) farm.totalLandArea = updateFarmDto.totalLandArea;
    if (updateFarmDto.crop !== undefined) farm.crop = updateFarmDto.crop;
    if (updateFarmDto.latitude !== undefined) farm.latitude = updateFarmDto.latitude;
    if (updateFarmDto.longitude !== undefined) farm.longitude = updateFarmDto.longitude;
    if (updateFarmDto.soilType !== undefined) farm.soilType = updateFarmDto.soilType;
    if (updateFarmDto.waterSource !== undefined) farm.waterSource = updateFarmDto.waterSource;
    if (updateFarmDto.sowingDate !== undefined) farm.sowingDate = new Date(updateFarmDto.sowingDate);
    if (updateFarmDto.currentGrowthStage !== undefined) farm.currentGrowthStage = updateFarmDto.currentGrowthStage;
    if (updateFarmDto.pastPestIssues !== undefined) farm.pastPestIssues = updateFarmDto.pastPestIssues;
    if (updateFarmDto.irrigationType !== undefined) farm.irrigationType = updateFarmDto.irrigationType;
    if (updateFarmDto.waterAvailabilityStatus !== undefined) farm.waterAvailabilityStatus = updateFarmDto.waterAvailabilityStatus;
    if (updateFarmDto.fertilizersUsed !== undefined) farm.fertilizersUsed = updateFarmDto.fertilizersUsed;

    farm.lastUpdateDate = new Date();
    
    return this.farmRepository.save(farm);
  }

  async deleteFarm(userId: string, farmId: string): Promise<void> {
    console.log("delete called");
    
    const farm = await this.getFarmById(userId, farmId);
        console.log("farm fetched!");

    for (const image of farm.images) {
      await this.cloudinaryService.deleteFile(image.publicId);
    }
    
    await this.farmRepository.remove(farm);
  }
  
  async deleteFarm1(userId: string, farmId: string): Promise<void> {
    
    const farmImages = await this.farmImageRepository.find({
      where: { farm: { id: farmId, userId } },
      select: ['publicId']
    });
    
    
    if (farmImages.length > 0) {
      await Promise.all(
        farmImages.map(image => this.cloudinaryService.deleteFile(image.publicId))
      );
    }
    
    await this.farmRepository.delete({ id: farmId, userId });
  }

  async uploadFarmImages(userId: string, farmId: string, files: Express.Multer.File[]): Promise<Farm> {
    if (files.length < 3) {
      throw new BadRequestException('At least 3 images are required');
    }

    const farm = await this.getFarmById(userId, farmId);
    
    // Process images - upload to Cloudinary using your existing service
    const uploadPromises = files.map(file => this.cloudinaryService.uploadFile(file));
    const uploadResults = await Promise.all(uploadPromises);
    
    const farmImages = uploadResults.map(result => {
      if (!result) {
        throw new Error('Failed to upload image');
      }
      
      return this.farmImageRepository.create({
        url: result.secure_url,
        publicId: result.public_id,
        farmId: farm.id,
        uploadDate: new Date(),
      });
    });

    


    await this.farmImageRepository.save(farmImages);
    
    // Process images with Python API and save results
    return this.processUploadedImages(farm, farmImages);
  }

  private async processUploadedImages(farm: Farm, farmImages: FarmImage[]): Promise<Farm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (const image of farmImages) {
        image.farmId = farm.id;
      }
      
      await queryRunner.manager.save(farmImages);

      const imageUrls = farmImages.map(image => image.url);
      
      
      const farmParameters = {
        crop: farm.crop,
        farmLocation: farm.farmLocation,
        currentGrowthStage: farm.currentGrowthStage,
        soilType: farm.soilType,
        sowingDate: farm.sowingDate instanceof Date 
          ? farm.sowingDate.toISOString() 
          : farm.sowingDate,
        irrigationType: farm.irrigationType,
        waterSource: farm.waterSource,
        waterAvailabilityStatus: farm.waterAvailabilityStatus,
        fertilizersUsed: Array.isArray(farm.fertilizersUsed) 
          ? farm.fertilizersUsed.join(', ') 
          : farm.fertilizersUsed || ''
      };
      
      const reportData = await this.pythonApiService.generateReport(imageUrls, farmParameters);
      
      const farmImageReport = this.farmImageReportRepository.create({
        farmId: farm.id,
        reportText: reportData.report,
        summary: reportData.summary,
        reportDate: new Date(),
      });
      
      await queryRunner.manager.save(farmImageReport);

      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const incompleteTasks = farm.tasks
        .filter(task => {
          return task.status !== TaskStatus.COMPLETED && task.dueDate >= sevenDaysAgo;
        })
        .map(task => ({
          taskId: task.id,
          title: task.title,
          priority: task.priority,
          dueDate: task.dueDate.toISOString(),
          status: task.status,
          description: task.taskDescription,
        }));

      console.log("incompleteTasks",incompleteTasks);
      

      const taskResponse = await this.pythonApiService.createTasks(
        farmParameters,
        reportData.report,
        incompleteTasks
      );

      const weather_data = taskResponse.weather
      
      const tasksData = Array.isArray(taskResponse.tasks) 
        ? taskResponse.tasks 
        : (taskResponse.tasks?.tasks || []);
      
      if (!Array.isArray(tasksData)) {
        throw new Error('Expected tasks data to be an array');
      }

      const farmTasks = tasksData.map(taskData => 
        this.farmTaskRepository.create({
          farmId: farm.id,
          taskId: taskData.taskId,
          title: taskData.title,
          priority: taskData.priority,
          dueDate: new Date(taskData.dueDate),
          status: taskData.status,
          context: taskData.context,
          taskDescription: taskData.taskDescription,
          steps: taskData.steps,
          supportingInformation: taskData.supportingInformation,
          followUp: taskData.followUp,
          dependencies: taskData.dependencies
        })
      );

      await queryRunner.manager.save(farmTasks);
      
      const formattedTasks = farmTasks.map(task => ({
        taskId: task.taskId,
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate.toISOString(),
        status: task.status,
        context: task.context,
        taskDescription: task.taskDescription,
        steps: task.steps,
        supportingInformation: task.supportingInformation,
        followUp: task.followUp,
        dependencies: task.dependencies
      }));

      const advisoryResponse = await this.pythonApiService.createAdvisory(
        farmParameters,
        reportData.report,
        formattedTasks,
        weather_data 
      );

      const farmAdvisory = this.farmAdvisoryRepository.create({
        farmId: farm.id,
        advisoryData: advisoryResponse,
        advisoryDate: new Date(),
      });
      
      await queryRunner.manager.save(farmAdvisory);
      
      farm.lastUpdateDate = new Date();
      farm.onboardingCompleted = true;

      const farmToSave = { ...farm };
      await queryRunner.manager.update(Farm, farm.id, {
        lastUpdateDate: farmToSave.lastUpdateDate,
        onboardingCompleted: farmToSave.onboardingCompleted
      });
      
      await queryRunner.commitTransaction();
        
      return this.getFarmById(farm.userId, farm.id);
    } catch (error) {
      this.logger.error(`Failed to process farm images: ${error.message}`);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }


  async updateTaskStatus(userId: string, taskId: string, status: TaskStatus): Promise<FarmTask> {
    const task = await this.farmTaskRepository.findOne({
      where: { id: taskId },
      relations: ['farm'],
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    if (task.farm.userId !== userId) {
      throw new NotFoundException('Task not found');
    }
    
    task.status = status;
    return this.farmTaskRepository.save(task);
  }

  async checkWeeklyUpdateRequired(farmId: string): Promise<boolean> {
    const farm = await this.farmRepository.findOne({
      where: { id: farmId },
    });
    
    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
    
    if (!farm.lastUpdateDate) {
      return true;
    }
    
    const now = new Date();
    const lastUpdateDate = new Date(farm.lastUpdateDate);
    
    const isMonday = now.getDay() === 1;
    const lastUpdateDay = lastUpdateDate.getDay();
    const lastUpdateWeek = this.getWeekNumber(lastUpdateDate);
    const currentWeek = this.getWeekNumber(now);
    
    return isMonday && (lastUpdateWeek !== currentWeek || lastUpdateDay !== 1);
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  // @Cron('0 0 * * 1')
  // async handleWeeklyResetForFarms() {
  //   this.logger.log('Running weekly farm status reset job');
    
  //   const farms = await this.farmRepository.find();
    
  //   for (const farm of farms) {
  //     if (farm.onboardingCompleted) {
  //       farm.lastUpdateDate = new Date(0); ;
  //       await this.farmRepository.save(farm);
  //     }
  //   }
    
  //   this.logger.log('Completed weekly farm status reset job');
  // }
}