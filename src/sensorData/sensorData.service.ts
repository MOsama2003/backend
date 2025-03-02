import {
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from './entities/sensorData.entity';
import { CreateSensorDataDto } from './dto/create-sensorData.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
    private readonly userService: UserService
  ) {}

  async create(data: CreateSensorDataDto) {
    if (!data?.deviceId) {
      throw new BadRequestException('Device ID is required');
    }
    const user = await this.userService.findByDeviceId(data.deviceId);
    if (!user) throw new UnauthorizedException();

    const sensorData = this.sensorDataRepository.create({...data, userId: user?.id});
    return await this.sensorDataRepository.save(sensorData);
  }
}
