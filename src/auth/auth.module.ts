import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailService } from '../mail/mail.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RequestedCounsellarService } from 'src/requested-counsellar/requested-counsellar.service';
import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([RequestedCounsellar]),
    PassportModule,
    JwtModule.register({
      secret: 'ACCESS-TOKEN',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, MailService, CloudinaryService, RequestedCounsellarService, RedisService],
})
export class AuthModule {}
