import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';


export enum MessageType {
  USER = 'user',
  ASSISTANT = 'assistant'
}
@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.USER })
  type: MessageType;

  @Column({ nullable: true })
  content: string;  

  @Column({ nullable: true })
  imageUrl?: string; 

  @CreateDateColumn()
  createdAt: Date;
}
