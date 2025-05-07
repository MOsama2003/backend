// farm.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { Farm } from './entities/farm.entity';
import { FarmImageReport } from './entities/farm-image-report.entity';
import { FarmTask } from './entities/farm-task.entity';
import { FarmAdvisory } from './entities/farm-advisory.entity';
import { PythonApiService } from './services/python-api.service';
import { FarmImage } from './entities/farm-image.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Farm, 
      FarmImage, 
      FarmImageReport, 
      FarmTask, 
      FarmAdvisory
    ]),
    HttpModule,
  ],
  controllers: [FarmController],
  providers: [FarmService, PythonApiService, CloudinaryService],
  exports: [FarmService],
})
export class FarmModule {}