import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from './entities/sensorData.entity';
import { CreateSensorDataDto } from './dto/create-sensorData.dto';
import { UserService } from 'src/user/user.service';
import { PaginationQueryDto } from './dto/Pagination-data.dto';
import { FirebaseService } from 'src/notifications/firebase.service';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
    private readonly userService: UserService,
    private readonly notificationService: FirebaseService,
  ) {}

  async create(data: CreateSensorDataDto) {
    // 1. Validate required fields
    if (!data?.deviceId) {
      throw new BadRequestException('Device ID is required');
    }

    // 2. Validate user/device
    const user = await this.userService.findByDeviceId(data.deviceId);
    if (!user) throw new UnauthorizedException();

    // 3. Validate sensor data ranges
    this.validateSensorData(data);

    // 4. Create and save if validation passes
    const sensorData = this.sensorDataRepository.create({
      ...data,
      userId: user?.id,
    });

    await this.notificationService.sendNotification(
      {
        title: 'New Data from farm has been added',
        body: 'check new data',
        data,
      },
      user.id,
    );

    return await this.sensorDataRepository.save(sensorData);
  }

  private validateSensorData(data: CreateSensorDataDto) {
    const validRanges = {
      nitrogen: { min: 0, max: 400 }, // mg/kg
      potassium: { min: 0, max: 600 }, // mg/kg
      phosphorus: { min: 0, max: 400 }, // mg/kg
      conductivity: { min: 0, max: 5000 }, // µS/cm
      pH: { min: 0, max: 14 }, // pH scale
      humidity: { min: 0, max: 100 }, // percentage
      temperature: { min: -20, max: 60 }, // °C (agricultural range)
    };

    // Check each field
    for (const [key, range] of Object.entries(validRanges)) {
      const value = data[key];

      if (value === undefined || value === null) {
        throw new BadRequestException(`${key} value is required`);
      }

      if (typeof value !== 'number' || isNaN(value)) {
        throw new BadRequestException(`${key} must be a valid number`);
      }

      if (value < range.min || value > range.max) {
        throw new BadRequestException(
          `${key} value ${value} is out of range (${range.min}-${range.max})`,
        );
      }
    }

    // Additional business logic validations
    this.validateBusinessRules(data);
  }

  private validateBusinessRules(data: CreateSensorDataDto) {
    if (data.pH < 5.5 && data.conductivity > 2000) {
      throw new BadRequestException(
        'Invalid combination: Low pH with high conductivity unlikely',
      );
    }

    if (data.temperature > 40 && data.humidity > 90) {
      throw new BadRequestException(
        'Invalid combination: High temperature with high humidity unlikely',
      );
    }
  }

  async dataListing(PaginationQueryDto: PaginationQueryDto, req: any) {
    const { page = 1, limit = 10 } = PaginationQueryDto;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const [sensorData, total] = await this.sensorDataRepository.findAndCount({
        where: { deviceId: req.user.deviceId },
        skip,
        take,
        select: [
          'id',
          'nitrogen',
          'conductivity',
          'pH',
          'humidity',
          'temperature',
          'potassium',
          'phosphorus',
          'createdAt',
        ],
      });

      const pageCount = Math.ceil(total / take);
      const hasNextPage = currentPage < pageCount;
      const hasPrevPage = currentPage > 1;

      return {
        data: sensorData,
        metaData: {
          totalCount: total,
          pageCount,
          page: currentPage,
          take,
          hasNextPage,
          hasPrevPage,
          itemCount: sensorData.length,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while fetching posts.',
      );
    }
  }

  async lastEntry(deviceId: string) {
    return await this.sensorDataRepository.findOne({
      where: { deviceId },
      order: { createdAt: 'DESC' },
    });
  }

  async lastTwoEntries(deviceId: string) {
    return await this.sensorDataRepository.find({
      where: { deviceId },
      order: { createdAt: 'DESC' },
      take: 2,
    });
  }
}
