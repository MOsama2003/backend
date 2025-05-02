// farm.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFiles,
  BadRequestException 
} from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Farm } from './entities/farm.entity';
import { FarmTask } from './entities/farm-task.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FarmService } from './farm.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

export type FarmWithUpdateStatus = Farm & {
  updateRequired: boolean;
};

@ApiTags('farms')
@ApiBearerAuth() 
@Controller('farms')
@UseGuards(JwtAuthGuard)
export class FarmController {
  constructor(
    private readonly farmService: FarmService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  async createFarm(
    @Request() req,
    @Body() createFarmDto: CreateFarmDto,
  ): Promise<Farm> {
    return this.farmService.createFarm(req.user.id, createFarmDto);
  }

  @Get()
  async getFarms(@Request() req): Promise<Farm[]> {
    return this.farmService.getFarms(req.user.id);
  }

  @Get(':id')
  async getFarm(
    @Request() req,
    @Param('id') id: string,
  ): Promise<FarmWithUpdateStatus> {
    const farm = await this.farmService.getFarmById(req.user.id, id);
    
    const updateRequired = await this.farmService.checkWeeklyUpdateRequired(id);
    
    return {
      ...farm,
      updateRequired,
    };
  }

  @Put(':id')
  async updateFarm(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFarmDto: UpdateFarmDto,
  ): Promise<Farm> {
    return this.farmService.updateFarm(req.user.id, id, updateFarmDto);
  }

  @Delete(':id')
  async deleteFarm(
    @Request() req,
    @Param('id') id: string,
  ): Promise<void> {
    return this.farmService.deleteFarm(req.user.id, id);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Upload farm images' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Farm ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Farm images (min 3, max 5)',
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 5 },
  ], {
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, 
    }
  }))
  async uploadFarmImages(
    @Request() req,
    @Param('id') id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<Farm> {
    if (!files.images || files.images.length < 3) {
      throw new BadRequestException('At least 3 images are required');
    }
    
    return this.farmService.uploadFarmImages(req.user.id, id, files.images);
  }



  @Put('tasks/:taskId/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update farm task status' })
  @ApiParam({ name: 'taskId', description: 'ID of the task to be updated' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully', type: FarmTask })
  @ApiResponse({ status: 404, description: 'Task not found or does not belong to the user' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async updateTaskStatus(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<FarmTask> {
    return this.farmService.updateTaskStatus(
      req.user.id,
      taskId,
      updateTaskStatusDto.status,
    );
  }

}