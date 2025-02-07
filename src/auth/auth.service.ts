import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>, 
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(user: { deviceId: string; role: string; id: number }) {
    const payload = {
      deviceId: user.deviceId,
      role: user.role,
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: { id: number }) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: 'REFRESH-TOKEN',
      expiresIn: '30d',
    });
  }

  // Validate user with the provided ID
  async validateUser(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // Get user by deviceId
  async findUserByDeviceId(deviceId: string) {
    return this.userRepository.findOne({ where: { deviceId } });
  }
}
