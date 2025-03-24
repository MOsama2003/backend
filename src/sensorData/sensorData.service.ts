import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException
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
    private readonly notificationService: FirebaseService
  ) {}

  async create(data: CreateSensorDataDto) {
    if (!data?.deviceId) {
      throw new BadRequestException('Device ID is required');
    }
    const user = await this.userService.findByDeviceId(data.deviceId);
    if (!user) throw new UnauthorizedException();

    const sensorData = this.sensorDataRepository.create({...data, userId: user?.id});
    
    await this.notificationService.sendNotification({
      title : 'New Data from farm has been added',
      body: 'check new data',
      data
    }, user.id)

    return await this.sensorDataRepository.save(sensorData);
  }

  async dataListing(PaginationQueryDto : PaginationQueryDto, req : any){
    const { page = 1, limit = 10 } = PaginationQueryDto;
        
        try {
          const currentPage = Math.max(1, page);
          const take = Math.max(1, limit);
          const skip = (currentPage - 1) * take;
      
          
          const [sensorData, total] = await this.sensorDataRepository.findAndCount({
            where: { deviceId : req.user.deviceId},
            skip,
            take,
            select: ['id', 'nitrogen', 'conductivity', 'pH', 'humidity', 'temperature', 'potassium','phosphorus', 'createdAt']
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
            'Something went wrong while fetching posts.'
          );
        }
  }

  async lastTwoEntries(deviceId : string) {
    const lastTwoEntries = await this.sensorDataRepository.find({
      where: {deviceId},
      order: { id: "DESC" },
      take: 2,
    });
    return lastTwoEntries
  }
}
