import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], // Load environment variables from .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false }, // Required for Neon DB
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        entities: [__dirname + "/**/*.entity{.ts,.js}"]
      }),
    }),
    UserModule,
    AuthModule,
    CloudinaryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
