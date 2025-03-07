import { IsNotEmpty, IsString } from 'class-validator';
import { PostReaction } from 'src/constants';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Feed } from './feed.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PostReaction })
  status: PostReaction;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Feed, (feed) => feed.reaction, { onDelete: 'CASCADE' })
  post: Feed;
}
