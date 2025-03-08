import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './entities/feed.entity';
import { Comment } from './entities/comment.entity';
import { Reaction } from './entities/reaction.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [FeedController],
  providers: [FeedService],
  imports: [
    TypeOrmModule.forFeature([Feed, Comment, Reaction, User]),
    CloudinaryModule,
  ],
})
export class FeedModule {}
