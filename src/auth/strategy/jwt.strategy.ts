import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ACCESS-TOKEN',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(+payload.id);
    if (user?.disabled) {
      throw new UnauthorizedException('User is disabled');
    }
    return {
      id: payload.id,
      deviceId: payload.deviceId,
      role: payload.role,
    };
  }
}
