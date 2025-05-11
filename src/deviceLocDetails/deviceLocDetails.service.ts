import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateDeviceLocDetails } from './dto/create-deviceLocDetails.dto';
import { DeviceLocDetails } from './entities/deviceLocDetails.entity';

@Injectable()
export class DeviceLocDetailsService {
  constructor(
    @InjectRepository(DeviceLocDetails)
    private readonly deviceLocDetailRepository: Repository<DeviceLocDetails>,
    private readonly userService: UserService,
  ) {}

  private validateCoordinates(latitude: number, longitude: number) {
    if (latitude < -90 || latitude > 90) {
      throw new BadRequestException(
        'Invalid latitude value. Must be between -90 and 90.',
      );
    }
    if (longitude < -180 || longitude > 180) {
      throw new BadRequestException(
        'Invalid longitude value. Must be between -180 and 180.',
      );
    }
  }

  async createOrUpdate(data: CreateDeviceLocDetails) {
    if (!data?.deviceId) {
      throw new BadRequestException('Device ID is required');
    }

    const user = await this.userService.findByDeviceId(data.deviceId);
    if (!user) throw new UnauthorizedException();

    // Convert lat/lng to numbers and validate
    this.validateCoordinates(data?.latitude, data?.longitude);

    const existingEntry = await this.deviceLocDetailRepository.findOne({
      where: { deviceId: data.deviceId },
    });

    if (existingEntry) {
      // Update the existing entry
      await this.deviceLocDetailRepository.update(existingEntry.id, {
        ...data,
        userId: user.id,
      });
      return {
        message: 'Location updated successfully',
        deviceId: data.deviceId,
      };
    } else {
      // Create a new entry
      const newEntry = this.deviceLocDetailRepository.create({
        ...data,
        userId: user.id,
      });
      return await this.deviceLocDetailRepository.save(newEntry);
    }
  }

  // device-loc-details.service.ts

  async getByDeviceId(deviceId: string) {
    console.log(deviceId,'dddddddddddddddd')
    const location = await this.deviceLocDetailRepository.findOne({
      where: { deviceId }
    });

    if (!location) {
      throw new NotFoundException(`Location for device ${deviceId} not found`);
    }

    return location;
  }
}
