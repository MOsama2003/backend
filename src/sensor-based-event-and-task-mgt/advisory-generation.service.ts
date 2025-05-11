import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DeviceAdvisory } from './entities/advisory.entity';
import { FirebaseService } from 'src/notifications/firebase.service';
import { GetDeviceAdvisoryDto } from './dto/get-sensor-based-tasks.dto';

@Injectable()
export class SensorBasedAdvisoryService {
  constructor(
    @InjectRepository(DeviceAdvisory)
    private readonly advisoryRepository: Repository<DeviceAdvisory>,
    private readonly notificationService: FirebaseService
  ) {}

  async saveAdvisories(advisories: any[], deviceId: string, req): Promise<DeviceAdvisory[]> {
    const advisoryEntities = advisories.map(advisory => ({
      ...advisory,
      deviceId,
      createdAt: new Date(),
    }));

    if (req?.user?.id) {
      await this.notificationService.sendNotification({
        title: 'New Advisories added',
        body: `New Advisories added for your device`,
        data: {deviceId : deviceId},
      }, +req.user.id);
    }
    
    
    return this.advisoryRepository.save(advisoryEntities);
  }

  async getAdvisoryOfWholeWeek(deviceId: string): Promise<DeviceAdvisory[]> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); 
    endOfWeek.setHours(23, 59, 59, 999);
  
    return this.advisoryRepository.find({
      where: {
        deviceId,
        createdAt: Between(startOfWeek, endOfWeek),
      },
      order: { createdAt: "DESC" },
    });
  }

  async lastTwoEntries(deviceId : string) {
    const lastTwoEntries = await this.advisoryRepository.find({
      where: {deviceId},
      order: { id: "DESC" },
      take: 2,
    });
    return lastTwoEntries
  }

  async getAdvisories(deviceId: string, query: GetDeviceAdvisoryDto) {
      const { page = 1, limit = 5 } = query;
      if(!deviceId){
        return {
          advisories: null
        }
      }
      const whereClause: any = { deviceId };
      const [advisories, total] = await this.advisoryRepository.findAndCount({
        where: whereClause,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
  
      return {
        total,
        page,
        limit,
        advisories,
      };
    }

    async lastEntry(deviceId: string) {
      if (!deviceId) {
        return {
          advisory: null,
        };
      }
      const advisory = await this.advisoryRepository.findOne({
        where: { deviceId },
        order: { createdAt: 'DESC' },
      });
  
      return {
        advisory,
      };
    }
}
