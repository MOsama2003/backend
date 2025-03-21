import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceAdvisory } from './entities/advisory.entity';

@Injectable()
export class SensorBasedAdvisoryService {
  constructor(
    @InjectRepository(DeviceAdvisory)
    private readonly advisoryRepository: Repository<DeviceAdvisory>,
  ) {}

  async saveAdvisories(advisories: any[], deviceId: string): Promise<DeviceAdvisory[]> {
    const advisoryEntities = advisories.map(advisory => ({
      ...advisory,
      deviceId,
      createdAt: new Date(),
    }));

    return this.advisoryRepository.save(advisoryEntities);
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
