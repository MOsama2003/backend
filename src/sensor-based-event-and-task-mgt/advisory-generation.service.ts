import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DeviceAdvisory } from './entities/advisory.entity';
import { FirebaseService } from 'src/notifications/firebase.service';

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

    await this.notificationService.sendNotification({
      title : 'New Advisories added for today',
      body: 'check Events',
      data: advisories
    }, +req.user.id)
    
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
}
