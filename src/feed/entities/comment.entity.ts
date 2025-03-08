import { IsNotEmpty, IsString } from 'class-validator';
import { PostReaction } from 'src/constants';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feed } from './feed.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  commentText: string;

  @ManyToOne(() => Comment, (comment) => comment.id, { nullable: true })
  parentComment: Comment;

  @Column()
  @IsNotEmpty()
  publishedDate: string;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
  commentAuthor: User;

  @ManyToOne(() => Feed, (feed) => feed.reaction, { onDelete: 'CASCADE' })
  post: Feed;

  @ManyToMany(() => User, {nullable : true})
  @JoinTable()
  mentions: User[];
}
