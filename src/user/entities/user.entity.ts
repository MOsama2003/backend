import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { Blog } from 'src/blog/entities/blog.entity';
import { Comment } from 'src/feed/entities/comment.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { Reaction } from 'src/feed/entities/reaction.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Column({ nullable: true })
  role: string;

  @Column({ unique: true, nullable: true })
  deviceId: string;

  @Column({ nullable: true })
  createdAt: string;

  @Column({ default: false })
  disabled: boolean;

  @Column({ nullable: true })
  fcmToken: string;

  @OneToMany(() => Blog, (article) => article.user, { cascade: true })
  blog: Blog[];

  @OneToMany(() => Feed, (feed) => feed.publisher, { cascade: true })
  feed: Feed[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.commentAuthor, {
    cascade: true,
  })
  comment: Comment;

  @ManyToMany(() => Comment, (comment) => comment.mentions)
  mentionedIn: Comment[];

  @OneToMany(()=> Notification, (notification)=>notification.user)
  notifications: Notification[];
}
