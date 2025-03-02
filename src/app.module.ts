import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SensorDataModule } from './sensorData/sensorData.module';
import { DeviceLocDetailsModule } from './deviceLocDetails/deviceLocDetails.module';
import { RequestedCounsellarModule } from './requested-counsellar/requested-counsellar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false }, 
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        entities: [__dirname + "/**/*.entity{.ts,.js}"]
      }),
    }),
    UserModule,
    AuthModule,
    CloudinaryModule,
    SensorDataModule,
    DeviceLocDetailsModule,
    RequestedCounsellarModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
