import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  imports: [TypeOrmModule.forFeature([Blog]), CloudinaryModule, UserModule]
})
export class BlogModule {}
