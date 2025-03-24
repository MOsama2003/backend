import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [TypeOrmModule.forFeature([Blog]), CloudinaryModule, UserModule, NotificationsModule]
})
export class BlogModule {}
